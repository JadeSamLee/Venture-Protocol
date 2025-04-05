import { ethers } from 'ethers';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Configure the blockchain client
export const publicClient = createPublicClient({
  chain: baseSepolia, // Default to Base Sepolia testnet
  transport: http(),
});

// Interface for event handlers
export interface EventHandler {
  eventName: string;
  contractAddress: string;
  abi: any; // Contract ABI for the event
  handler: (event: any) => Promise<void>;
}

// BlockchainMonitor class to track events and execute actions
export class BlockchainMonitor {
  private eventHandlers: EventHandler[] = [];
  private isMonitoring: boolean = false;
  private provider: ethers.JsonRpcProvider;
  private pollInterval: number;
  private maxEvents: number;
  
  constructor(
    rpcUrl: string = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
    pollInterval: number = Number(process.env.NEXT_PUBLIC_AGENT_POLL_INTERVAL) || 15000,
    maxEvents: number = Number(process.env.NEXT_PUBLIC_AGENT_MAX_EVENTS) || 50
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.pollInterval = pollInterval;
    this.maxEvents = maxEvents;
    console.log(`BlockchainMonitor configured with poll interval: ${this.pollInterval}ms, max events: ${this.maxEvents}`);
  }

  // Add an event handler
  public registerEventHandler(handler: EventHandler): void {
    this.eventHandlers.push(handler);
    console.log(`Registered handler for ${handler.eventName} on ${handler.contractAddress}`);
  }

  // Start monitoring for all registered events
  public async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Starting blockchain monitoring...');
    
    // Set up event listeners for each registered handler
    for (const handler of this.eventHandlers) {
      const contract = new ethers.Contract(
        handler.contractAddress,
        handler.abi,
        this.provider
      );
      
      contract.on(handler.eventName, async (...args) => {
        try {
          // The last argument contains the event details
          const event = args[args.length - 1];
          await handler.handler(event);
        } catch (error) {
          console.error(`Error handling event ${handler.eventName}:`, error);
        }
      });
    }
    
    // Also monitor new blocks for general monitoring
    this.provider.on('block', (blockNumber) => {
      console.log(`New block: ${blockNumber}`);
    });
  }

  // Stop monitoring
  public stopMonitoring(): void {
    if (!this.isMonitoring) return;
    
    this.provider.removeAllListeners();
    this.isMonitoring = false;
    console.log('Stopped blockchain monitoring');
  }

  // Execute a contract function
  public async executeContract(
    contractAddress: string,
    abi: any,
    functionName: string,
    params: any[],
    privateKey: string
  ): Promise<ethers.TransactionResponse> {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contract = new ethers.Contract(contractAddress, abi, wallet);
      
      console.log(`Executing ${functionName} on ${contractAddress}`);
      const tx = await contract[functionName](...params);
      return tx;
    } catch (error) {
      console.error(`Error executing contract function ${functionName}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance
export const blockchainMonitor = new BlockchainMonitor(); 