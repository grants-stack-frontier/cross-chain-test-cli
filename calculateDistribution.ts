import { Vote, VoteWithChains } from "./types";
import { getTokenForChain } from "./utils/constants";

export function calculateDistribution(
  votes: Vote[],
  fromChain: number,
  toChain: number,
  strategy: string,
): { votes: VoteWithChains[] } {
  return {
    votes: votes.map((vote) => ({
      ...vote,
      token: getTokenForChain(fromChain, strategy),
      fromChain,
      toChain,
    })),
  };
}
