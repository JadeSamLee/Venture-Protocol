import { NextRequest, NextResponse } from 'next/server';
import { NoditAPI, formatAddress, weiToEther } from '../../index';

/**
 * GET handler for transaction history endpoint
 * Fetches transaction history for an account with enhanced metadata
 * @param request NextRequest object
 * @returns NextResponse with transaction history data
 */
export async function GET(request: NextRequest) {
  try {
    // Get parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const chain = (searchParams.get('chain') || 'BASE') as any;
    const network = (searchParams.get('network') || 'SEPOLIA') as any;
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Use the Blockchain API to get transactions
    const txData = await NoditAPI.web3Data.BlockchainApi.getTransactionsByAccount(
      address, 
      { limit, offset, includeInternalTxs: true },
      chain,
      network
    );
    
    // Process transactions to add useful information
    const enhancedTxs = await Promise.all(
      (txData.transactions || []).map(async (tx: any) => {
        try {
          // Get full transaction data using Node API
          const fullTx = await NoditAPI.node.EthereumRPC.getTransactionByHash(
            tx.hash,
            chain,
            network
          );
          
          // Get transaction receipt for status and gas used
          const receipt = await NoditAPI.node.EthereumRPC.getTransactionReceipt(
            tx.hash,
            chain,
            network
          );
          
          // Enhance transaction with computed properties
          return {
            ...tx,
            from: tx.from || fullTx?.from,
            to: tx.to || fullTx?.to,
            formattedFrom: formatAddress(tx.from || fullTx?.from),
            formattedTo: formatAddress(tx.to || fullTx?.to),
            value: {
              wei: fullTx?.value || '0x0',
              ether: weiToEther(fullTx?.value || '0x0')
            },
            status: receipt?.status === '0x1' ? 'success' : 'failed',
            gasUsed: receipt?.gasUsed || '0x0',
            gasPrice: fullTx?.gasPrice || '0x0',
            timestamp: tx.timestamp || Date.now() / 1000,
            blockNumber: parseInt(tx.blockNumber || fullTx?.blockNumber || '0', 16),
          };
        } catch (error) {
          console.error(`Error enhancing transaction ${tx.hash}:`, error);
          return tx;
        }
      })
    );

    return NextResponse.json({
      address,
      transactions: enhancedTxs,
      total: txData.total || enhancedTxs.length,
      limit,
      offset,
      chain,
      network
    });
  } catch (error) {
    console.error('Error in transaction history API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
} 