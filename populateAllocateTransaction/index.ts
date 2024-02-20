import { Vote } from "../types";
import populateQVSimpleAllocateTransaction from "./QVSimple";
import { ethers } from "ethers";

export async function populateAllocateTransaction(
  type: string,
  vote: Vote,
): Promise<{ tx: ethers.ContractTransaction; vote: Vote }> {
  switch (type) {
    case "QVSimple": {
      return populateQVSimpleAllocateTransaction(vote);
    }
    default: {
      throw new Error("Unknown allocate transaction type");
    }
  }
}
