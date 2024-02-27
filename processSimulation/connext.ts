import { ethers } from "ethers";
import { Result } from "../types";

export const processConnextSimulateTransaction = async (
  simulation: ethers.providers.TransactionResponse,
  quote: any,
  createdAt: string,
): Promise<Result> => {
  const txReceipt = await simulation.wait();

  const gasCost = txReceipt.gasUsed;
  const feeCost = quote.costs.feeCosts;

  const totalCostUSD = gasCost.add(feeCost).toNumber();
  // const gasPrice = txReceipt.effectiveGasPrice.toString();
  const gasPrice = txReceipt.effectiveGasPrice.toString();

  return {
    txHash: simulation.hash,
    fromChain: quote.request.fromChain,
    fromTokenAddress: quote.request.contractCalls[0].fromTokenAddress,
    fromTokenAmount: quote.request.contractCalls[0].fromAmount,
    toChain: quote.request.toChain,
    toTokenAddress: quote.request.toToken,
    toTokenAmount: quote.request.toAmount,
    gasPrice,
    totalCostUSD,
    createdAt,
    strategy: "connext",
  };
};
