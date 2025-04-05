import { useQuery } from '@tanstack/react-query';

interface NoditApiOptions {
  chain?: string;
  network?: string;
}

/**
 * Hook to fetch account balance data using Nodit API
 * @param address - Ethereum address to query
 * @param options - Additional options for the API call
 * @returns Query result with account balance data
 */
export function useAccountBalance(
  address: string | undefined,
  options: NoditApiOptions = {}
) {
  const { chain, network } = options;
  
  return useQuery({
    queryKey: ['accountBalance', address, chain, network],
    queryFn: async () => {
      if (!address) throw new Error('Address is required');
      
      const params = new URLSearchParams();
      params.append('address', address);
      if (chain) params.append('chain', chain);
      if (network) params.append('network', network);
      
      const response = await fetch(`/api/nodit/routes/account-balance?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch account balance');
      }
      
      return response.json();
    },
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch transaction history data using Nodit API
 * @param address - Ethereum address to query
 * @param options - Additional options for the API call
 * @returns Query result with transaction history data
 */
export function useTransactionHistory(
  address: string | undefined,
  options: NoditApiOptions & { limit?: number; offset?: number } = {}
) {
  const { chain, network, limit = 10, offset = 0 } = options;
  
  return useQuery({
    queryKey: ['transactionHistory', address, chain, network, limit, offset],
    queryFn: async () => {
      if (!address) throw new Error('Address is required');
      
      const params = new URLSearchParams();
      params.append('address', address);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      if (chain) params.append('chain', chain);
      if (network) params.append('network', network);
      
      const response = await fetch(`/api/nodit/routes/transaction-history?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch transaction history');
      }
      
      return response.json();
    },
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch token transfers data using Nodit API
 * @param options - Options for querying token transfers
 * @returns Query result with token transfers data
 */
export function useTokenTransfers(
  options: NoditApiOptions & {
    address?: string;
    contract?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const { address, contract, chain, network, limit = 20, offset = 0 } = options;
  
  return useQuery({
    queryKey: ['tokenTransfers', address, contract, chain, network, limit, offset],
    queryFn: async () => {
      if (!address && !contract) throw new Error('Either address or contract is required');
      
      const params = new URLSearchParams();
      if (address) params.append('address', address);
      if (contract) params.append('contract', contract);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      if (chain) params.append('chain', chain);
      if (network) params.append('network', network);
      
      const response = await fetch(`/api/nodit/routes/token-transfers?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch token transfers');
      }
      
      return response.json();
    },
    enabled: !!(address || contract),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to check if an address is a contract using Nodit API
 * @param address - Ethereum address to check
 * @param options - Additional options for the API call
 * @returns Query result with contract status
 */
export function useIsContract(
  address: string | undefined,
  options: NoditApiOptions = {}
) {
  const { chain, network } = options;
  
  return useQuery({
    queryKey: ['isContract', address, chain, network],
    queryFn: async () => {
      if (!address) throw new Error('Address is required');
      
      // This would typically call a dedicated API endpoint
      // For demo, we'll construct a URL to the backend
      // In a real app, you would create a dedicated API endpoint for this
      const params = new URLSearchParams();
      params.append('address', address);
      if (chain) params.append('chain', chain);
      if (network) params.append('network', network);
      
      // This endpoint doesn't exist yet - you would need to create it
      const response = await fetch(`/api/nodit/blockchain/is-contract?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check if address is contract');
      }
      
      return response.json();
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
} 