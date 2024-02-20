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
