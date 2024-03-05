import { ethers } from "ethers";
import { VoteWithChains } from "../types";
import { generateLifiTransaction } from "./lifi";
import { generateConnextTransaction } from "./connext";
import { generateDecentTransaction } from "./decent";

export async function generateStrategyTransactions(
  strategy: string,
  tx: ethers.PopulatedTransaction,
  vote: VoteWithChains,
) {
  switch (strategy) {
    case "lifi":
      return generateLifiTransaction(tx, vote);
    case "connext":
      return generateConnextTransaction(tx, vote);
    case "decent":
      return generateDecentTransaction(tx, vote);
    default:
      throw new Error(`Strategy ${strategy} not implemented`);
  }
}
