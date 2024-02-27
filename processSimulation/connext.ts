import { ethers } from "ethers";
import { Result } from "../types";
import { formatEther } from "ethers/lib/utils";

export const processConnextSimulateTransaction = async (
  simulation: ethers.providers.TransactionResponse,
  quote: any,
): Promise<Result> => {
  const txReceipt = await simulation.wait();

  const ethereumPrice = 3238.48;
  const gasCost = txReceipt.gasUsed;
  const feeCost = quote.costs.feeCosts;

  const totalCostEthereum = formatEther(gasCost.add(feeCost));
  const totalCostUSD = Number(totalCostEthereum) * ethereumPrice;
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
    strategy: "connext",
  };
};
