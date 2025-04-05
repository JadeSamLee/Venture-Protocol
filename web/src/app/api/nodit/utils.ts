import { EthereumRPC } from './node-api';

/**
 * Converts wei amount to Ether
 * @param weiAmount - Amount in wei (hex or decimal)
 * @returns Amount in Ether as a number
 */
export function weiToEther(weiAmount: string | number): number {
  // Convert hex string to decimal if needed
  const wei = typeof weiAmount === 'string' && weiAmount.startsWith('0x')
    ? BigInt(weiAmount)
    : BigInt(weiAmount);
  
  return Number(wei) / 1e18;
}

/**
 * Converts Ether amount to wei
 * @param etherAmount - Amount in Ether
 * @returns Amount in wei as a BigInt
 */
export function etherToWei(etherAmount: number): BigInt {
  return BigInt(Math.floor(etherAmount * 1e18));
}

/**
 * Formats an address with middle truncation
 * @param address - The Ethereum address to format
 * @param chars - Number of characters to show at start and end
 * @returns Formatted address string
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= 2 * chars) return address;
  
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

/**
 * Waits for a transaction to be mined and confirmed
 * @param txHash - Transaction hash to wait for
 * @param confirmations - Number of confirmations to wait for
 * @returns Transaction receipt
 */
export async function waitForTransaction(txHash: string, confirmations = 1): Promise<any> {
  let receipt = null;
  let currentBlock = await EthereumRPC.blockNumber();
  const currentBlockNumber = parseInt(currentBlock, 16);
  
  // Poll until transaction is mined
  while (!receipt) {
    try {
      receipt = await EthereumRPC.getTransactionReceipt(txHash);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
    } catch (error) {
      console.error('Error checking transaction receipt:', error);
      await new Promise(resolve => setTimeout(resolve, 4000)); // Wait longer on error
    }
  }
  
  // Wait for confirmations if needed
  if (confirmations > 1) {
    const receiptBlockNumber = parseInt(receipt.blockNumber, 16);
    
    while (currentBlockNumber - receiptBlockNumber < confirmations - 1) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds between confirmation checks
      currentBlock = await EthereumRPC.blockNumber();
      const newBlockNumber = parseInt(currentBlock, 16);
      
      if (newBlockNumber > currentBlockNumber) {
        console.log(`Transaction ${txHash} has ${newBlockNumber - receiptBlockNumber + 1} confirmations`);
      }
    }
  }
  
  return receipt;
}

/**
 * Gets the ENS name for an address (if available)
 * Uses reverse lookup on ENS
 * @param address - Ethereum address
 * @returns ENS name or null if not found
 */
export async function getENSName(address: string): Promise<string | null> {
  try {
    // This is a mock implementation - would need to be replaced with actual ENS lookup
    // Using the Nodit Web3 Data API ENS endpoints if available
    return null;
  } catch (error) {
    console.error('Error getting ENS name:', error);
    return null;
  }
}

/**
 * Decodes ABI-encoded function call data
 * @param data - The calldata to decode
 * @param abi - The contract ABI
 * @returns Decoded function name and parameters
 */
export function decodeCalldata(data: string, abi: any[]): { name: string; params: any[] } | null {
  try {
    // This is a mock implementation - in a real app you'd use ethers.js or similar
    return null;
  } catch (error) {
    console.error('Error decoding calldata:', error);
    return null;
  }
}

/**
 * Estimates current network gas cost in USD
 * @param gasLimit - Gas limit for the transaction
 * @returns Estimated cost in USD
 */
export async function estimateGasCostInUSD(gasLimit: number): Promise<number> {
  try {
    const gasPrice = await EthereumRPC.gasPrice();
    const gasPriceInWei = BigInt(gasPrice);
    const totalGasCostInWei = gasPriceInWei * BigInt(gasLimit);
    
    // Mock ETH price - in a real app, you'd fetch this from an API
    const ethUsdPrice = 2500;
    
    return Number(totalGasCostInWei) / 1e18 * ethUsdPrice;
  } catch (error) {
    console.error('Error estimating gas cost:', error);
    return 0;
  }
} 