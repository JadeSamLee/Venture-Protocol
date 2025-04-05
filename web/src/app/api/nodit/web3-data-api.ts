import axios from 'axios';
import { CONFIG, getEndpoint, validateApiKey } from './config';

// Type for chain and network options
type ChainOption = 'ETHEREUM' | 'BASE';
type NetworkOption = 'MAINNET' | 'SEPOLIA' | 'HOLESKY';

// Base URL for Web3 Data API endpoints (modify as needed based on Nodit docs)
const getWeb3DataApiUrl = (chain: ChainOption = 'BASE', network: NetworkOption = 'SEPOLIA') => {
  // This URL structure is a guess based on the Node API pattern
  // You may need to adjust based on exact Nodit Web3 Data API documentation
  const baseUrl = getEndpoint(chain, network);
  return `${baseUrl}/web3data`;
};

/**
 * Makes a call to the Nodit Web3 Data API
 * @param endpoint - The specific API endpoint path
 * @param params - The parameters for the API call
 * @param method - HTTP method (GET or POST)
 * @param chain - The blockchain to query
 * @param network - The network to query
 * @returns Promise with the API response
 */
export async function callWeb3DataApi(
  endpoint: string,
  params: any = {},
  method: 'GET' | 'POST' = 'GET',
  chain: ChainOption = 'BASE',
  network: NetworkOption = 'SEPOLIA'
) {
  if (!validateApiKey()) {
    throw new Error('API key not configured');
  }

  const baseUrl = getWeb3DataApiUrl(chain, network);
  const url = `${baseUrl}/${endpoint}`;

  try {
    let response;
    if (method === 'GET') {
      response = await axios.get(url, { 
        ...CONFIG, 
        params 
      });
    } else {
      response = await axios.post(url, params, CONFIG);
    }

    return response.data;
  } catch (error) {
    console.error(`Error calling Nodit Web3 Data API (${endpoint}):`, error);
    throw error;
  }
}

// NFT API functions
export const NFTApi = {
  // Get NFT Contract Metadata by Contracts
  getContractMetadata: (contracts: string[], chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/contract-metadata', { contracts }, 'POST', chain, network),
  
  // Get NFT Transfers By Account
  getTransfersByAccount: (account: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/transfers-by-account', { account, ...params }, 'GET', chain, network),
  
  // Get NFT Transfers By Contract
  getTransfersByContract: (contract: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/transfers-by-contract', { contract, ...params }, 'GET', chain, network),
  
  // Get NFT Transfers By TokenId
  getTransfersByTokenId: (contract: string, tokenId: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/transfers-by-tokenid', { contract, tokenId, ...params }, 'GET', chain, network),
  
  // Get NFT Transfers Within Range
  getTransfersInRange: (fromBlock: number, toBlock: number, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/transfers-in-range', { fromBlock, toBlock, ...params }, 'GET', chain, network),
  
  // Get NFTs Owned By Account
  getOwnershipByAccount: (account: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/owned-by-account', { account, ...params }, 'GET', chain, network),
  
  // Search NFT Contract Metadata By Keyword
  searchByKeyword: (keyword: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/search', { keyword, ...params }, 'GET', chain, network),
  
  // Sync NFT Metadata
  syncMetadata: (contract: string, tokenId: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('nft/sync-metadata', { contract, tokenId }, 'POST', chain, network),
};

// Token API functions
export const TokenApi = {
  // Get Token Allowance
  getAllowance: (contract: string, owner: string, spender: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/allowance', { contract, owner, spender }, 'GET', chain, network),
  
  // Get Token Contract Metadata by Contracts
  getContractMetadata: (contracts: string[], chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/contract-metadata', { contracts }, 'POST', chain, network),
  
  // Get Token Holders By Contract
  getHoldersByContract: (contract: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/holders', { contract, ...params }, 'GET', chain, network),
  
  // Get Token Prices by Contracts
  getPricesByContracts: (contracts: string[], chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/prices', { contracts }, 'POST', chain, network),
  
  // Get Token Transfers by Account
  getTransfersByAccount: (account: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/transfers-by-account', { account, ...params }, 'GET', chain, network),
  
  // Get Token Transfers by Contract
  getTransfersByContract: (contract: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/transfers-by-contract', { contract, ...params }, 'GET', chain, network),
  
  // Get Token Transfers Within Range
  getTransfersInRange: (fromBlock: number, toBlock: number, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/transfers-in-range', { fromBlock, toBlock, ...params }, 'GET', chain, network),
  
  // Get Tokens Owned By Account
  getOwnershipByAccount: (account: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/owned-by-account', { account, ...params }, 'GET', chain, network),
  
  // Search Token Contract Metadata by Keyword
  searchByKeyword: (keyword: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('token/search', { keyword, ...params }, 'GET', chain, network),
};

// Native Token API functions
export const NativeTokenApi = {
  // Get Native Balance by Account
  getBalanceByAccount: (account: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('native/balance', { account }, 'GET', chain, network),
};

// Blockchain API functions
export const BlockchainApi = {
  // Get Block by Hash or Number
  getBlock: (blockHashOrNumber: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/block', { block: blockHashOrNumber }, 'GET', chain, network),
  
  // Get Blocks Within Range
  getBlocksInRange: (fromBlock: number, toBlock: number, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/blocks-in-range', { fromBlock, toBlock }, 'GET', chain, network),
  
  // Get Gas Price
  getGasPrice: (chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/gas-price', {}, 'GET', chain, network),
  
  // Get Internal Transactions By Account
  getInternalTxsByAccount: (account: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/internal-txs-by-account', { account, ...params }, 'GET', chain, network),
  
  // Get Internal Transactions By Transaction Hash
  getInternalTxsByHash: (hash: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/internal-txs-by-hash', { hash }, 'GET', chain, network),
  
  // Get Next Nonce by Account
  getNextNonce: (account: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/next-nonce', { account }, 'GET', chain, network),
  
  // Get Transaction By Hash
  getTransactionByHash: (hash: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/tx', { hash }, 'GET', chain, network),
  
  // Get Transactions By Account
  getTransactionsByAccount: (account: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/txs-by-account', { account, ...params }, 'GET', chain, network),
  
  // Get Transactions By Hashes
  getTransactionsByHashes: (hashes: string[], chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/txs-by-hashes', { hashes }, 'POST', chain, network),
  
  // Get Transactions In Block
  getTransactionsInBlock: (blockHashOrNumber: string, params: any = {}, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/txs-in-block', { block: blockHashOrNumber, ...params }, 'GET', chain, network),
  
  // Is Contract
  isContract: (address: string, chain?: ChainOption, network?: NetworkOption) =>
    callWeb3DataApi('blockchain/is-contract', { address }, 'GET', chain, network),
}; 