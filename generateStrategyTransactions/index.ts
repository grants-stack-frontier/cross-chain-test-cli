import {ethers} from "ethers";
import {Vote} from "../types";
import {generateLifiTransaction} from "./lifi";

export async function generateStrategyTransactions(strategy: string, tx: ethers.PopulatedTransaction, vote: Vote) {
  switch (strategy) {
    case 'lifi':
      return generateLifiTransaction(tx, vote);
    default:
      throw new Error(`Strategy ${strategy} not implemented`);
  }
}

