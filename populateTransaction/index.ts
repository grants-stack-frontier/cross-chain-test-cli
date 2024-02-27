import { Vote } from "../types";
import populateAllocateTransaction from "./allocate";
import { ethers } from "ethers";

export async function populateTransaction(
  type: string,
  vote: Vote,
): Promise<{ tx: ethers.PopulatedTransaction; vote: Vote }> {
  switch (type) {
    case "allocate": {
      return populateAllocateTransaction(vote);
    }
    default: {
      throw new Error("Unknown allocate transaction type");
    }
  }
}
