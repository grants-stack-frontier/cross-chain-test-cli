import {BigNumber} from "ethers";

export type Vote = {
  chain_id: number;
  voter: string;
  amount: BigNumber;
  token: string;
  amountUSD: number;
  payoutAddress: string;
  round_name: string;
  roundAddress: string;
  tx_gasPrice: BigNumber;
  tx_gasSpent: BigNumber;
  tx_timestamp: Date;
}