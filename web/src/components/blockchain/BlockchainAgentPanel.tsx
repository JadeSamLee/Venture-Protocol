'use client';

import { useState, useEffect } from 'react';
import { blockchainAgent, AgentResponse } from '@/lib/agent/blockchain-agent';
import { EventHandler } from '@/lib/blockchain/monitor';

interface BlockchainAgentPanelProps {
  contractAddresses?: Record<string, string>;
  abis?: Record<string, any>;
}

export function BlockchainAgentPanel({ 
  contractAddresses = {},
  abis = {}
}: BlockchainAgentPanelProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [events, setEvents] = useState<{timestamp: number; event: string; response?: AgentResponse}[]>([]);
  const [newRule, setNewRule] = useState({ eventType: '', rule: '' });
  const [eventHandlers, setEventHandlers] = useState<EventHandler[]>([]);
  const [newEvent, setNewEvent] = useState({ name: '', contractAddress: '', abi: '' });

  // Toggle monitoring state
  const toggleMonitoring = () => {
    if (isMonitoring) {
      blockchainAgent.stopMonitoring();
      setIsMonitoring(false);
    } else {
      // Start monitoring with current handlers
      blockchainAgent.startMonitoring(eventHandlers);
      setIsMonitoring(true);
      
      // Add fake event for demonstration
      setTimeout(() => {
        addDemoEvent();
      }, 5000);
    }
  };

  // Add a rule for the agent
  const addRule = () => {
    if (newRule.eventType && newRule.rule) {
      blockchainAgent.addRule(newRule.eventType, newRule.rule);
      setNewRule({ eventType: '', rule: '' });
    }
  };

  // Add a new event handler
  const addEventHandler = () => {
    if (newEvent.name && newEvent.contractAddress) {
      // Get ABI from provided ABIs or use empty array
      const abi = abis[newEvent.contractAddress] || [];
      
      const handler: EventHandler = {
        eventName: newEvent.name,
        contractAddress: newEvent.contractAddress,
        abi,
        handler: async (event) => {
          // This is just for UI updates - the actual handler is created in blockchainAgent.startMonitoring
          const timestamp = Date.now();
          setEvents(prev => [
            { timestamp, event: JSON.stringify(event, null, 2) },
            ...prev
          ]);
        }
      };
      
      setEventHandlers(prev => [...prev, handler]);
      setNewEvent({ name: '', contractAddress: '', abi: '' });
    }
  };

  // Demo function to simulate an event for testing
  const addDemoEvent = () => {
    if (eventHandlers.length === 0) return;
    
    // Create a sample event
    const sampleEvent = {
      transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      blockNumber: Math.floor(Math.random() * 1000000),
      args: {
        from: `0x${Math.random().toString(16).substring(2, 42)}`,
        to: `0x${Math.random().toString(16).substring(2, 42)}`,
        value: Math.floor(Math.random() * 1000000000).toString()
      }
    };
    
    const eventHandler = eventHandlers[0];
    
    // Log the demo event
    const timestamp = Date.now();
    setEvents(prev => [
      { 
        timestamp, 
        event: JSON.stringify(sampleEvent, null, 2) 
      },
      ...prev
    ]);
    
    // Process the event with the agent
    blockchainAgent.processEvent(sampleEvent, eventHandler.eventName)
      .then(response => {
        // Update the event with the response
        setEvents(prev => {
          const updated = [...prev];
          if (updated[0] && updated[0].timestamp === timestamp) {
            updated[0].response = response;
          }
          return updated;
        });
      });
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4">Blockchain Monitoring Agent</h2>
      
      {/* Monitoring Controls */}
      <div className="mb-6">
        <button
          onClick={toggleMonitoring}
          className={`px-4 py-2 rounded font-semibold ${
            isMonitoring 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
        
        <span className="ml-4">
          Status: <span className={isMonitoring ? 'text-green-500' : 'text-gray-400'}>
            {isMonitoring ? 'Active' : 'Inactive'}
          </span>
        </span>
      </div>
      
      {/* Event Handler Configuration */}
      <div className="mb-6 p-4 border rounded bg-white dark:bg-gray-700">
        <h3 className="text-lg font-semibold mb-2">Event Handlers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            value={newEvent.name}
            onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
            placeholder="Event Name (e.g. Transfer)"
            className="p-2 border rounded dark:bg-gray-800"
          />
          <input
            type="text"
            value={newEvent.contractAddress}
            onChange={(e) => setNewEvent({...newEvent, contractAddress: e.target.value})}
            placeholder="Contract Address"
            className="p-2 border rounded dark:bg-gray-800"
          />
          <button
            onClick={addEventHandler}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Event Handler
          </button>
        </div>
        
        {/* List of current event handlers */}
        <div className="mt-3">
          {eventHandlers.map((handler, index) => (
            <div key={index} className="p-2 bg-gray-100 dark:bg-gray-600 rounded mb-2">
              <p><strong>Event:</strong> {handler.eventName}</p>
              <p><strong>Contract:</strong> {handler.contractAddress}</p>
            </div>
          ))}
          {eventHandlers.length === 0 && (
            <p className="text-gray-500 italic">No event handlers configured</p>
          )}
        </div>
      </div>
      
      {/* Agent Rules Configuration */}
      <div className="mb-6 p-4 border rounded bg-white dark:bg-gray-700">
        <h3 className="text-lg font-semibold mb-2">Agent Rules</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            value={newRule.eventType}
            onChange={(e) => setNewRule({...newRule, eventType: e.target.value})}
            placeholder="Event Type"
            className="p-2 border rounded dark:bg-gray-800"
          />
          <input
            type="text"
            value={newRule.rule}
            onChange={(e) => setNewRule({...newRule, rule: e.target.value})}
            placeholder="Rule (e.g. 'If value > 1000, call function X')"
            className="p-2 border rounded dark:bg-gray-800"
          />
          <button
            onClick={addRule}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Rule
          </button>
        </div>
      </div>
      
      {/* Event Log */}
      <div className="p-4 border rounded bg-white dark:bg-gray-700">
        <h3 className="text-lg font-semibold mb-2">Event Log</h3>
        
        {events.length === 0 ? (
          <p className="text-gray-500 italic">No events detected yet</p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {events.map((event, index) => (
              <div key={index} className="p-3 bg-gray-100 dark:bg-gray-600 rounded">
                <p className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
                <div className="mt-2 mb-2">
                  <p className="font-mono text-xs overflow-x-auto p-2 bg-gray-200 dark:bg-gray-700 rounded">
                    {event.event}
                  </p>
                </div>
                {event.response && (
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                    <p><strong>Decision:</strong> {event.response.decision}</p>
                    <p>
                      <strong>Action:</strong> 
                      {event.response.actionRequired 
                        ? `Call ${event.response.functionName} on ${event.response.contractToCall}` 
                        : 'No action needed'
                      }
                    </p>
                    <p><strong>Reasoning:</strong> {event.response.reasoning}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Demo event button */}
        {isMonitoring && (
          <button
            onClick={addDemoEvent}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Simulate Event (Demo)
          </button>
        )}
      </div>
    </div>
  );
} 