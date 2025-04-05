export interface Project {
  id: string;
  name: string;
  description: string;
  fundingGoal: bigint;
  currentPhase: Phase;
  tokenCirculation: number;
  founderAddress: string;
  createdAt: string;
  updatedAt: string;
  totalStaked?: bigint;
  investorCount?: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number;
  balance: bigint;
}

export enum Phase {
  ESCROW = 'ESCROW',
  PHASE_1 = 'PHASE_1',
  PHASE_2 = 'PHASE_2',
  COMPLETED = 'COMPLETED'
}

export interface Investment {
  id: string;
  projectId: string;
  projectName: string;
  investorAddress: string;
  amount: bigint;
  timestamp: string;
}

export interface TokenEconomics {
  totalSupply: number;
  distribution: {
    founders: number;
    investors: number;
    community: number;
    reserve: number;
  };
} 