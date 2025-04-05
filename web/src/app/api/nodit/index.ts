// Configuration exports
export * from './config';

// Node API (RPC) exports
export {
  callNodeApi,
  EthereumRPC,
  Web3RPC,
  NetRPC,
  OptimismRPC,
} from './node-api';

// Web3 Data API exports
export {
  callWeb3DataApi,
  NFTApi,
  TokenApi,
  NativeTokenApi,
  BlockchainApi,
} from './web3-data-api';

// Utility function exports
export * from './utils';

// Convenience re-exports of all API modules
import * as NodeAPI from './node-api';
import * as Web3DataAPI from './web3-data-api';
import * as Utils from './utils';
import * as Config from './config';

// Export modules as namespaces
export { NodeAPI, Web3DataAPI, Utils, Config };

/**
 * Main NoditAPI wrapper
 * Provides access to all Nodit APIs
 */
export const NoditAPI = {
  // Node API (RPC) methods
  node: NodeAPI,
  
  // Web3 Data API methods
  web3Data: Web3DataAPI,
  
  // Utils
  utils: Utils,
  
  // Configuration
  config: Config,
}; 