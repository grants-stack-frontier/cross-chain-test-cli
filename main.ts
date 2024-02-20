import axios from 'axios';
import { ethers } from 'ethers';
import {processFile} from "./utils/parse_csv";

const endpoint = 'https://li.quest/v1/quote/contractCall';

const DAI_ON_BSC = '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3';
const KLIMA_ON_POL = '0x4e78011ce80ee02d2c3e649fb657e45898257815';
const SKLIMA_ON_POL = '0xb0c22d8d350c67420f06f48936654f567c73e8c8';

const KLIMA_STAKING_CONTRACT = '0x4D70a031Fc76DA6a9bC0C922101A05FA95c3A227';

// Full ABI on
// https://polygonscan.com/address/0x4D70a031Fc76DA6a9bC0C922101A05FA95c3A227#code
const KLIMA_STAKING_ABI = ['function stake(uint _amount) external'];

const filePath = 'example_votes.csv';


const generateKLIMATransaction = async (receivedAmount: string) => {
    const stakeKlimaTx = await new ethers.Contract(
      KLIMA_STAKING_CONTRACT,
      KLIMA_STAKING_ABI
    ).populateTransaction.stake(receivedAmount);
    return stakeKlimaTx;
};

const getQuote = async (): Promise<any> => {
    // We would like to stake this amount of KLIMA to get sKLIMA
    const stakeAmount = '300000000';

    const stakeKlimaTx = await generateKLIMATransaction(stakeAmount);

    const quoteRequest = {
        fromChain: 'BSC',
        fromToken: DAI_ON_BSC,
        fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
        toChain: 'POL',
        toToken: KLIMA_ON_POL,
        toAmount: stakeAmount,
        toContractAddress: stakeKlimaTx.to,
        toContractCallData: stakeKlimaTx.data,
        toContractGasLimit: '900000',
        contractOutputsToken: SKLIMA_ON_POL,
    };

    const response = await axios.post(endpoint, quoteRequest);
    return response.data;
};


async function main() {
    const votes = await processFile(filePath);
    console.log(votes);
    // getQuote().then(console.log);
}

main();