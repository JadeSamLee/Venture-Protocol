'use client';

import { useState } from 'react';
import {
  useAccountBalance,
  useTransactionHistory,
  useTokenTransfers
} from '@/hooks/useNoditData';

interface AccountOverviewProps {
  defaultAddress?: string;
}

export function AccountOverview({ defaultAddress = '' }: AccountOverviewProps) {
  const [address, setAddress] = useState<string>(defaultAddress);
  const [inputAddress, setInputAddress] = useState<string>(defaultAddress);
  
  // Using our custom hooks to fetch data
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError
  } = useAccountBalance(address);
  
  const {
    data: transactionData,
    isLoading: isTransactionsLoading,
    error: transactionsError
  } = useTransactionHistory(address, { limit: 5 });
  
  const {
    data: tokenTransfersData,
    isLoading: isTokenTransfersLoading,
    error: tokenTransfersError
  } = useTokenTransfers({ address, limit: 5 });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress(inputAddress);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nodit API Account Overview</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="Enter Ethereum address"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load
          </button>
        </div>
      </form>
      
      {!address && (
        <div className="text-center p-12 border rounded bg-gray-50">
          Enter an address to view blockchain data
        </div>
      )}
      
      {address && (
        <div className="space-y-8">
          {/* Account Balance Section */}
          <section className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Account Balance</h2>
            {isBalanceLoading ? (
              <p>Loading balance data...</p>
            ) : balanceError ? (
              <p className="text-red-500">Error loading balance: {(balanceError as Error).message}</p>
            ) : balanceData ? (
              <div>
                <p className="text-lg font-mono">
                  <span className="font-normal text-gray-600">Address: </span>
                  {balanceData.address}
                </p>
                <p className="text-xl mt-2">
                  <span className="font-normal text-gray-600">Native Balance: </span>
                  {balanceData.nativeBalance?.ether.toFixed(4) || '0'} {balanceData.chain === 'BASE' ? 'ETH' : 'ETH'}
                </p>
                
                {balanceData.tokens && balanceData.tokens.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Tokens ({balanceData.tokens.length})</h3>
                    <ul className="space-y-2">
                      {balanceData.tokens.map((token: any) => (
                        <li key={token.contractAddress} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium">{token.name || 'Unknown Token'}</div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{token.symbol}</span>
                            <span>{token.balance}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-500">No tokens found</p>
                )}
              </div>
            ) : null}
          </section>
          
          {/* Recent Transactions Section */}
          <section className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            {isTransactionsLoading ? (
              <p>Loading transaction data...</p>
            ) : transactionsError ? (
              <p className="text-red-500">Error loading transactions: {(transactionsError as Error).message}</p>
            ) : transactionData?.transactions && transactionData.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Hash</th>
                      <th className="px-4 py-2 text-left">To</th>
                      <th className="px-4 py-2 text-right">Value</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionData.transactions.map((tx: any) => (
                      <tr key={tx.hash} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-sm">
                          {tx.hash.substring(0, 10)}...
                        </td>
                        <td className="px-4 py-2 font-mono text-sm">
                          {tx.formattedTo || tx.to.substring(0, 10) + '...'}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {tx.value?.ether.toFixed(4) || '0'} ETH
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${
                            tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status || 'unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No transactions found</p>
            )}
          </section>
          
          {/* Token Transfers Section */}
          <section className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Token Transfers</h2>
            {isTokenTransfersLoading ? (
              <p>Loading token transfer data...</p>
            ) : tokenTransfersError ? (
              <p className="text-red-500">Error loading token transfers: {(tokenTransfersError as Error).message}</p>
            ) : tokenTransfersData?.transfers && tokenTransfersData.transfers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Token</th>
                      <th className="px-4 py-2 text-left">From</th>
                      <th className="px-4 py-2 text-left">To</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenTransfersData.transfers.map((transfer: any, index: number) => (
                      <tr key={`${transfer.hash}-${index}`} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="font-medium">{transfer.token?.symbol || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{transfer.token?.name}</div>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm">
                          {transfer.formattedFrom}
                        </td>
                        <td className="px-4 py-2 font-mono text-sm">
                          {transfer.formattedTo}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {typeof transfer.amount?.formatted === 'number' 
                            ? transfer.amount.formatted.toFixed(4) 
                            : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No token transfers found</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
} 