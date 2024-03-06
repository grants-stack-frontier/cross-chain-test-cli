import { ethers } from "ethers";
import { Result } from "../types";
import { formatEther } from "ethers/lib/utils";

const getPriceForChain = (chain: number) => {
  switch (chain) {
    case 10:
    case 42161:
      return 3797.88;
    case 137:
      return 1.08;
    default:
      throw new Error(`Chain ${chain} not supported`);
  }
};

export const processConnextSimulateTransaction = async (
  simulation: ethers.providers.TransactionResponse,
  quote: any,
): Promise<Result> => {
  const txReceipt = await simulation.wait();

  const price = getPriceForChain(quote.request.fromChain);
  const gasCost = txReceipt.gasUsed;
  const feeCost = quote.costs.feeCosts;

  const totalCostEthereum = formatEther(gasCost.add(feeCost));

  const totalCostUSD = Number(totalCostEthereum) * price;
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
