import {Vote} from "./types";

export function calculateDistribution(votes: Vote[], strategy: string) {
  return {
    votes,
    targetChain: 10,
  };
}