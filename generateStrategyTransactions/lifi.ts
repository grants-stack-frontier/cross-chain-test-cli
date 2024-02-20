import {ethers} from "ethers";
import {Vote} from "../types";
import axios from "axios";

const endpoint = 'https://li.quest/v1/quote/contractCall';

const DAI_ON_BSC = '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3';
const KLIMA_ON_POL = '0x4e78011ce80ee02d2c3e649fb657e45898257815';
const SKLIMA_ON_POL = '0xb0c22d8d350c67420f06f48936654f567c73e8c8';

const KLIMA_STAKING_CONTRACT = '0x4D70a031Fc76DA6a9bC0C922101A05FA95c3A227';

export async function generateLifiTransaction(tx: ethers.PopulatedTransaction, vote: Vote) {
  // Generate transactions for the
  const quote = await getQuote(tx);
  console.log(quote);
}

const getQuote = async (tx: ethers.PopulatedTransaction): Promise<any> => {
  // We would like to stake this amount of KLIMA to get sKLIMA
  const stakeAmount = '300000000';


  const quoteRequest = {
    fromChain: 'BSC',
    fromToken: DAI_ON_BSC,
    fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
    toChain: 'POL',
    toToken: KLIMA_ON_POL,
    toAmount: stakeAmount,
    toContractAddress: tx.to,
    toContractCallData: tx.data,
    toContractGasLimit: '900000',
    contractOutputsToken: SKLIMA_ON_POL,
  };

  const response = await axios.post(endpoint, quoteRequest);
  return response.data;
};