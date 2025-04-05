import { NextRequest, NextResponse } from 'next/server';
import { NoditAPI, weiToEther } from '../../index';

/**
 * GET handler for account balance endpoint
 * Fetches both native token balance and token balances for an account
 * @param request NextRequest object
 * @returns NextResponse with balance data
 */
export async function GET(request: NextRequest) {
  try {
    // Get account address from URL params
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    
    // Optional parameters
    const chain = (searchParams.get('chain') || 'BASE') as any;
    const network = (searchParams.get('network') || 'SEPOLIA') as any;
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Fetch data in parallel
    const [nativeBalance, tokenData] = await Promise.all([
      // Get native token balance (ETH, BASE, etc.)
      NoditAPI.node.EthereumRPC.getBalance(address, 'latest', chain, network)
        .then(balance => ({
          wei: balance,
          ether: weiToEther(balance)
        })),
      
      // Get all tokens owned by this account
      NoditAPI.web3Data.TokenApi.getOwnershipByAccount(address, {}, chain, network)
        .catch(err => {
          console.error('Error fetching token data:', err);
          return { tokens: [] };
        })
    ]);

    return NextResponse.json({
      address,
      nativeBalance,
      tokens: tokenData.tokens || [],
      chain,
      network
    });
  } catch (error) {
    console.error('Error in account balance API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account balance' },
      { status: 500 }
    );
  }
} 