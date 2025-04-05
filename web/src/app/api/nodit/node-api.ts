import axios from 'axios';
import { CONFIG, getEndpoint, validateApiKey } from './config';

// Interface for the RPC request
interface RpcRequest {
  id: number;
  jsonrpc: string;
  method: string;
  params: any[];
}

// Type for chain and network options
type ChainOption = 'ETHEREUM' | 'BASE';
type NetworkOption = 'MAINNET' | 'SEPOLIA' | 'HOLESKY';

/**
 * Makes a JSON-RPC call to the Nodit Node API
 * @param method - The RPC method to call (e.g., 'eth_getBalance')
 * @param params - The parameters for the method
 * @param chain - The blockchain to query (ETHEREUM or BASE)
 * @param network - The network to query (MAINNET, SEPOLIA, HOLESKY)
 * @returns Promise with the RPC response
 */
export async function callNodeApi(
  method: string,
  params: any[] = [],
  chain: ChainOption = 'BASE',
  network: NetworkOption = 'SEPOLIA'
) {
  if (!validateApiKey()) {
    throw new Error('API key not configured');
  }

  const endpoint = getEndpoint(chain, network);
  
  if (!endpoint) {
    throw new Error(`No endpoint available for chain ${chain} and network ${network}`);
  }
  
  const rpcRequest: RpcRequest = {
    id: 1,
    jsonrpc: '2.0',
    method,
    params,
  };

  try {
    const response = await axios.post(
      endpoint,
      JSON.stringify(rpcRequest),
      CONFIG
    );
    
    if (response.data.error) {
      throw new Error(`RPC Error: ${response.data.error.message}`);
    }

    return response.data.result;
  } catch (error) {
    console.error(`Error calling Nodit Node API (${method}):`, error);
    throw error;
  }
}

// Commonly used Ethereum RPC methods
export const EthereumRPC = {
  // Account methods
  getBalance: (address: string, block = 'latest', chain?: ChainOption, network?: NetworkOption) => 
    callNodeApi('eth_getBalance', [address, block], chain, network),
  
  getTransactionCount: (address: string, block = 'latest', chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_getTransactionCount', [address, block], chain, network),
  
  getCode: (address: string, block = 'latest', chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_getCode', [address, block], chain, network),
  
  // Block methods
  getBlockByNumber: (blockNumber: string | number, fullTransactions = false, chain?: ChainOption, network?: NetworkOption) => {
    // Convert number to hex if needed
    const blockParam = typeof blockNumber === 'number' ? '0x' + blockNumber.toString(16) : blockNumber;
    return callNodeApi('eth_getBlockByNumber', [blockParam, fullTransactions], chain, network);
  },
  
  getBlockByHash: (blockHash: string, fullTransactions = false, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_getBlockByHash', [blockHash, fullTransactions], chain, network),
  
  blockNumber: (chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_blockNumber', [], chain, network),
  
  // Transaction methods
  getTransactionByHash: (txHash: string, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_getTransactionByHash', [txHash], chain, network),
  
  getTransactionReceipt: (txHash: string, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_getTransactionReceipt', [txHash], chain, network),
  
  sendRawTransaction: (signedTx: string, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_sendRawTransaction', [signedTx], chain, network),
  
  // Contract methods
  call: (callObject: any, block = 'latest', chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_call', [callObject, block], chain, network),
  
  estimateGas: (callObject: any, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_estimateGas', [callObject], chain, network),
  
  // Log/event methods
  getLogs: (filterObject: any, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_getLogs', [filterObject], chain, network),
  
  // Network methods
  chainId: (chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_chainId', [], chain, network),
  
  gasPrice: (chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('eth_gasPrice', [], chain, network),
  
  // Debug methods (only for supported networks)
  traceTransaction: (txHash: string, tracerConfig: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('debug_traceTransaction', [txHash, tracerConfig], chain, network),
};

// Web3 methods
export const Web3RPC = {
  clientVersion: (chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('web3_clientVersion', [], chain, network),
  
  sha3: (data: string, chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('web3_sha3', [data], chain, network),
};

// Net methods
export const NetRPC = {
  version: (chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('net_version', [], chain, network),
  
  listening: (chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('net_listening', [], chain, network),
};

// Optimism-specific methods (for Base)
export const OptimismRPC = {
  outputAtBlock: (blockNumber: string | number, chain?: ChainOption, network?: NetworkOption) => {
    const blockParam = typeof blockNumber === 'number' ? '0x' + blockNumber.toString(16) : blockNumber;
    return callNodeApi('optimism_outputAtBlock', [blockParam], chain, network);
  },
  
  rollupConfig: (chain?: ChainOption, network?: NetworkOption) =>
    callNodeApi('optimism_rollupConfig', [], chain, network),
}; 