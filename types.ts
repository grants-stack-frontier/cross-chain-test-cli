import { BigNumber } from "ethers";

export type Vote = {
  chain_id: number;
  voter: string;
  amount: BigNumber;
  token: `0x${string}`;
  amountUSD: number;
  payoutAddress: `0x${string}`;
  round_name: string;
  roundAddress: `0x${string}`;
  tx_gasPrice: BigNumber;
  tx_gasSpent: BigNumber;
  tx_timestamp: Date;
};

export type VoteWithChains = Vote & {
  fromChain: number;
  toChain: number;
};

export type Result = {
  txHash: string;
  fromChain: number;
  fromTokenAddress: string;
  fromTokenAmount: string;
  toChain: number;
  toTokenAddress: string;
  toTokenAmount: string;
  gasPrice: string;
  totalCostUSD: number;
  strategy: string;
};
