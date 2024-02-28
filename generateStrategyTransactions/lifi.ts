import { ethers } from "ethers";
import { Vote } from "../types";
import axios from "axios";
import { USDC_ON_OP, USDC_ON_POL } from "../utils/constants";

// https://apidocs.li.fi/reference/post_quote-contractcalls
// https://docs.li.fi/integrate-li.fi-js-sdk/testing-your-integration
const endpoint = "https://li.quest/v1/quote/contractCalls";

export async function generateLifiTransaction(
  tx: ethers.PopulatedTransaction,
  vote: Vote,
) {
  // Generate transactions for the
  return await getQuote(tx);
}

const getQuote = async (tx: ethers.PopulatedTransaction): Promise<any> => {
  //USDC has 6 decimals
  const stakeAmount = ethers.utils.parseUnits("10", 6).toString();

  const contractCall = {
    fromAmount: stakeAmount,
    fromTokenAddress: USDC_ON_POL,
    toContractAddress: tx.to,
    toContractCallData: tx.data,
    toContractGasLimit: "90000",
  };

  const quoteRequest = {
    fromChain: 10, // OP
    fromToken: USDC_ON_OP,
    fromAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    toChain: 137,
    toToken: USDC_ON_POL,
    toAmount: stakeAmount,
    contractCalls: [contractCall],
  };

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
