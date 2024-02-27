import { ethers } from "ethers";
import { Result } from "../types";

export const processLifiSimulateTransaction = async (
  simulation: ethers.providers.TransactionResponse,
  quote: any,
  createdAt: string,
): Promise<Result> => {
  return {
    txHash: simulation.hash,
    fromChain: quote.request.fromChain,
    fromTokenAddress: quote.request.contractCalls[0].fromTokenAddress,
    fromTokenAmount: quote.request.contractCalls[0].fromAmount,
    toChain: quote.request.toChain,
    toTokenAddress: quote.request.toToken,
    toTokenAmount: quote.request.toAmount,
    gasPrice: simulation.gasPrice?.toString() || "0",
    totalCostUSD: quote.costs.feeCosts + quote.costs.gasCosts,
    createdAt,
    strategy: "lifi",
  };
};
