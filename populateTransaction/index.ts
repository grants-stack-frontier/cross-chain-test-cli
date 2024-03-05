import { VoteWithChains } from "../types";
import populateAllocateTransaction from "./allocate";
import populateMockAllocateTransaction from "./mockAllocate";
import { ethers } from "ethers";

export async function populateTransaction(
  type: string,
  vote: VoteWithChains,
): Promise<{ tx: ethers.PopulatedTransaction; vote: VoteWithChains }> {
  switch (type) {
    case "allocate": {
      return populateAllocateTransaction(vote);
    }
    case "mockAllocate": {
      return populateMockAllocateTransaction(vote);
    }
    default: {
      throw new Error("Unknown allocate transaction type");
    }
  }
}
