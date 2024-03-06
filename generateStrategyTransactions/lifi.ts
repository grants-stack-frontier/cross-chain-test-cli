import { ethers, PopulatedTransaction } from "ethers";
import { VoteWithChains } from "../types";
import axios from "axios";
import { getTokenForChain } from "../utils/constants";

// https://apidocs.li.fi/reference/post_quote-contractcalls
// https://docs.li.fi/integrate-li.fi-js-sdk/testing-your-integration
const endpoint = "https://li.quest/v1/quote/contractCalls";

export async function generateLifiTransaction(
  tx: ethers.PopulatedTransaction,
  vote: VoteWithChains,
) {
  // Generate transactions for the
  return await getQuote(tx, vote);
}

const getQuote = async (
  tx: PopulatedTransaction,
  vote: VoteWithChains,
): Promise<any> => {
  //USDC has 6 decimals
  const stakeAmount = ethers.utils.parseUnits("10", 6).toString();

  console.log(vote);

  const contractCall = {
    fromAmount: stakeAmount,
    fromTokenAddress: getTokenForChain(vote.toChain, "lifi"),
    toContractAddress: tx.to,
    toContractCallData: tx.data,
    toContractGasLimit: "1800000",
  };

  const quoteRequest = {
    fromChain: vote.fromChain,
    fromToken: vote.token,
    fromAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    toChain: vote.toChain,
    toToken: getTokenForChain(vote.toChain, "lifi"),
    toAmount: stakeAmount,
    contractCalls: [contractCall],
  };

  console.log("quoteRequest", quoteRequest);

  const response = await axios.post(endpoint, quoteRequest);

  return {
    request: quoteRequest,
    quote: response.data,
    costs: {
      feeCosts: response.data.estimate.feeCosts
        .map((fee: any) => fee.amountUSD)
        .reduce((a: any, b: any) => Number(a) + Number(b), 0),
      gasCosts: response.data.estimate.gasCosts
        .map((fee: any) => fee.amountUSD)
        .reduce((a: any, b: any) => Number(a) + Number(b), 0),
    },
  };
};
