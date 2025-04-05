// Nodit API Configuration

// Environment variable for the API key
// Add NEXT_PUBLIC_NODIT_API_KEY in .env file
const API_KEY = process.env.NEXT_PUBLIC_NODIT_API_KEY;

// Define chain and network types
export type ChainType = 'ETHEREUM' | 'BASE';
export type NetworkType = 'MAINNET' | 'SEPOLIA' | 'HOLESKY';

// Type for the endpoints object
type EndpointsType = {
  [C in ChainType]: {
    [N in NetworkType]?: string;
  }
};

// Network endpoints
export const ENDPOINTS: EndpointsType = {
  // Ethereum endpoints
  ETHEREUM: {
    MAINNET: `https://ethereum-mainnet.nodit.io/${API_KEY}`,
    SEPOLIA: `https://ethereum-sepolia.nodit.io/${API_KEY}`,
    HOLESKY: `https://ethereum-holesky.nodit.io/${API_KEY}`,
  },
  // Base endpoints
  BASE: {
    MAINNET: `https://base-mainnet.nodit.io/${API_KEY}`,
    SEPOLIA: `https://base-sepolia.nodit.io/${API_KEY}`,
  },
};

// Default network selection (configurable)
export const DEFAULT_NETWORK = {
  CHAIN: 'BASE' as ChainType,
  NETWORK: 'SEPOLIA' as NetworkType
};

// API configuration
export const CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': API_KEY
  },
  timeout: 30000, // 30 seconds timeout
};

// Utility to get the appropriate endpoint
export const getEndpoint = (chain = DEFAULT_NETWORK.CHAIN, network = DEFAULT_NETWORK.NETWORK) => {
  return ENDPOINTS[chain as ChainType]?.[network as NetworkType] || ENDPOINTS.BASE.SEPOLIA;
};

// Validate API key is configured
export const validateApiKey = () => {
  if (!API_KEY) {
    console.error('NEXT_PUBLIC_NODIT_API_KEY is not defined in .env file');
    return false;
  }
  return true;
}; 