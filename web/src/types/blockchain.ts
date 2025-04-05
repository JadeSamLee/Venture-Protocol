// Basic event from a smart contract
export interface BlockchainEvent {
  transactionHash: string;
  blockNumber: number;
  args: any;
}

// ERC20 Transfer event
export interface TransferEvent extends BlockchainEvent {
  args: {
    from: string;
    to: string;
    value: string; // BigNumber as string
  };
}

// DEX Swap event
export interface SwapEvent extends BlockchainEvent {
  args: {
    sender: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string; // BigNumber as string
    amountOut: string; // BigNumber as string
  };
}

// Vault Deposit event
export interface DepositEvent extends BlockchainEvent {
  args: {
    user: string;
    amount: string; // BigNumber as string
  };
}

// Vault Withdraw event
export interface WithdrawEvent extends BlockchainEvent {
  args: {
    user: string;
    amount: string; // BigNumber as string
  };
}

// Vault Harvest event
export interface HarvestEvent extends BlockchainEvent {
  args: {
    user: string;
    rewardAmount: string; // BigNumber as string
  };
}

// DEX LiquidityAdded event
export interface LiquidityAddedEvent extends BlockchainEvent {
  args: {
    tokenA: string;
    tokenB: string;
    amountA: string; // BigNumber as string
    amountB: string; // BigNumber as string
  };
}

// Smart contract interaction parameters
export interface ContractCallParams {
  contractAddress: string;
  functionName: string;
  params: any[];
}

// Agent rule for event processing
export interface AgentRule {
  eventType: string;
  condition: string;
  action: ContractCallParams;
} 