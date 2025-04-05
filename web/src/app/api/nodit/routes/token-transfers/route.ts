import { NextRequest, NextResponse } from 'next/server';
import { NoditAPI, formatAddress } from '../../index';

/**
 * GET handler for token transfers endpoint
 * Fetches token transfer history for an account or contract
 * with enhanced metadata including token details
 * @param request NextRequest object
 * @returns NextResponse with token transfer data
 */
export async function GET(request: NextRequest) {
  try {
    // Get parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const contract = searchParams.get('contract');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const chain = (searchParams.get('chain') || 'BASE') as any;
    const network = (searchParams.get('network') || 'SEPOLIA') as any;
    
    if (!address && !contract) {
      return NextResponse.json(
        { error: 'Either address or contract parameter is required' },
        { status: 400 }
      );
    }

    let transfers: any[] = [];
    let totalCount = 0;
    
    // Handle fetching by account or by contract
    if (address) {
      // Fetch token transfers for an account
      const transferData = await NoditAPI.web3Data.TokenApi.getTransfersByAccount(
        address,
        { limit, offset },
        chain, 
        network
      );
      transfers = transferData.transfers || [];
      totalCount = transferData.total || transfers.length;
    } else if (contract) {
      // Fetch token transfers for a contract
      const transferData = await NoditAPI.web3Data.TokenApi.getTransfersByContract(
        contract as string,
        { limit, offset },
        chain,
        network
      );
      transfers = transferData.transfers || [];
      totalCount = transferData.total || transfers.length;
    }

    // Get token contract metadata for all unique tokens
    const tokenContracts = Array.from(new Set(transfers.map(t => t.tokenAddress)));
    let tokenMetadata: Record<string, any> = {};
    
    if (tokenContracts.length > 0) {
      try {
        const metadata = await NoditAPI.web3Data.TokenApi.getContractMetadata(
          tokenContracts,
          chain,
          network
        );
        
        // Create lookup object by contract address
        if (metadata && metadata.tokens) {
          tokenMetadata = metadata.tokens.reduce((acc: Record<string, any>, token: any) => {
            acc[token.address] = token;
            return acc;
          }, {});
        }
      } catch (error) {
        console.error('Error fetching token metadata:', error);
      }
    }
    
    // Enhance transfers with token data and formatting
    const enhancedTransfers = transfers.map(transfer => {
      const token = (tokenMetadata[transfer.tokenAddress] || {}) as Record<string, any>;
      const decimals = token.decimals || 18;
      
      // Calculate token amount in human-readable form
      const rawAmount = BigInt(transfer.value || '0');
      const tokenAmount = Number(rawAmount) / Math.pow(10, decimals);
      
      return {
        ...transfer,
        formattedFrom: formatAddress(transfer.from),
        formattedTo: formatAddress(transfer.to),
        token: {
          address: transfer.tokenAddress,
          symbol: token.symbol || 'UNKNOWN',
          name: token.name || 'Unknown Token',
          decimals,
          logoUrl: token.logo || null
        },
        amount: {
          raw: transfer.value,
          formatted: tokenAmount
        },
        timestamp: transfer.timestamp || transfer.blockTimestamp,
        blockNumber: parseInt(transfer.blockNumber || '0', 16)
      };
    });

    return NextResponse.json({
      transfers: enhancedTransfers,
      total: totalCount,
      limit,
      offset,
      chain,
      network,
      query: { address, contract }
    });
  } catch (error) {
    console.error('Error in token transfers API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token transfers' },
      { status: 500 }
    );
  }
} 