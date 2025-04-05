import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { AgentKit } from '@coinbase/agentkit';
import { blockchainMonitor, EventHandler } from '../blockchain/monitor';

// Type definition for agent response
export interface AgentResponse {
  decision: string;
  actionRequired: boolean;
  contractToCall?: string;
  functionName?: string;
  params?: any[];
  reasoning: string;
}

// Blockchain Agent class for event monitoring and smart contract execution
export class BlockchainAgent {
  private agent: any; // LangChain agent
  private agentkit: AgentKit | null = null;
  private openAIApiKey: string;
  private privateKey: string;
  private predefinedRules: Record<string, string> = {};
  
  constructor(
    openAIApiKey: string = process.env.OPENAI_API_KEY || '',
    privateKey: string = process.env.PRIVATE_KEY || ''
  ) {
    this.openAIApiKey = openAIApiKey;
    this.privateKey = privateKey;
    
    // Initialize OpenAI model and agent
    this.initializeAgent();
  }
  
  // Initialize the LLM agent
  private async initializeAgent(): Promise<void> {
    try {
      // Initialize LLM
      const llm = new ChatOpenAI({ 
        openAIApiKey: this.openAIApiKey,
        model: "gpt-4o-mini" 
      });
      
      // Create agent with memory
      const memory = new MemorySaver();
      
      this.agent = createReactAgent({
        llm,
        tools: [], // We'll manually process blockchain interactions
        checkpointSaver: memory,
        messageModifier: `
          You are a blockchain monitoring agent that analyzes events and decides whether to 
          execute smart contract functions based on predefined rules. When you receive an event,
          analyze it according to the rules and determine if action is needed. Be precise and
          concise in your decisions, focusing on the specifics of the blockchain event data.
          If action is required, specify exactly which contract and function should be called,
          along with the necessary parameters.
        `,
      });
      
      console.log('Blockchain agent initialized successfully');
    } catch (error) {
      console.error('Error initializing blockchain agent:', error);
    }
  }
  
  // Add a rule for the agent to follow
  public addRule(eventType: string, rule: string): void {
    this.predefinedRules[eventType] = rule;
    console.log(`Added rule for ${eventType}: ${rule}`);
  }
  
  // Process an event and decide what action to take
  public async processEvent(event: any, eventType: string): Promise<AgentResponse> {
    try {
      const rule = this.predefinedRules[eventType] || '';
      
      // Format the event data for the agent
      const eventDescription = JSON.stringify(event, null, 2);
      
      // Ask the agent to analyze the event
      const prompt = `
        Event Type: ${eventType}
        Rule: ${rule}
        Event Data: ${eventDescription}
        
        Based on this event and the rule, determine if action is required.
        Return a JSON object with the following structure:
        {
          "decision": "Brief summary of your analysis",
          "actionRequired": true/false,
          "contractToCall": "contract address if action required",
          "functionName": "function to call if action required",
          "params": [parameters for the function],
          "reasoning": "explanation of your decision"
        }
      `;
      
      // Get response from the agent
      const stream = await this.agent.stream(
        { messages: [{ content: prompt, role: "user" }] }
      );
      
      let responseText = '';
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          responseText += chunk.agent.messages[0].content;
        }
      }
      
      // Parse the agent's response
      let response: AgentResponse;
      try {
        // Extract JSON from response (in case there's additional text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          response = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON in response');
        }
      } catch (e) {
        console.error('Failed to parse agent response:', e);
        // Fallback response if parsing fails
        response = {
          decision: 'Failed to analyze event properly',
          actionRequired: false,
          reasoning: 'Error in response format: ' + responseText
        };
      }
      
      // Execute action if required
      if (response.actionRequired && 
          response.contractToCall && 
          response.functionName && 
          response.params) {
        try {
          // Get ABI for the contract - in a real implementation you'd store/retrieve this
          const abi = await this.getContractABI(response.contractToCall);
          
          // Execute the contract function
          await this.executeSmartContract(
            response.contractToCall,
            abi,
            response.functionName,
            response.params
          );
          
          console.log(`Successfully executed ${response.functionName}`);
        } catch (execError) {
          console.error('Error executing contract function:', execError);
          response.decision += ' (Execution failed)';
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error processing event:', error);
      return {
        decision: 'Error processing event',
        actionRequired: false,
        reasoning: `Error: ${error}`
      };
    }
  }
  
  // Execute a smart contract function
  private async executeSmartContract(
    contractAddress: string,
    abi: any,
    functionName: string,
    params: any[]
  ): Promise<void> {
    await blockchainMonitor.executeContract(
      contractAddress,
      abi,
      functionName,
      params,
      this.privateKey
    );
  }
  
  // Get contract ABI - placeholder function
  // In a real implementation, you would store ABIs or fetch them from blockchain explorers
  private async getContractABI(contractAddress: string): Promise<any> {
    // Placeholder - in a real app, you'd fetch or store the ABI
    return []; // Return empty ABI as placeholder
  }
  
  // Start monitoring the blockchain with this agent
  public startMonitoring(eventHandlers: EventHandler[]): void {
    // Register all event handlers
    for (const handler of eventHandlers) {
      // Create a wrapped handler that passes events to the agent
      const wrappedHandler = async (event: any) => {
        const response = await this.processEvent(event, handler.eventName);
        console.log(`Agent response for ${handler.eventName}:`, response);
      };
      
      // Register with the blockchain monitor
      blockchainMonitor.registerEventHandler({
        ...handler,
        handler: wrappedHandler
      });
    }
    
    // Start the blockchain monitor
    blockchainMonitor.startMonitoring();
  }
  
  // Stop monitoring
  public stopMonitoring(): void {
    blockchainMonitor.stopMonitoring();
  }
}

// Create singleton instance with environment variables
export const blockchainAgent = new BlockchainAgent(); 