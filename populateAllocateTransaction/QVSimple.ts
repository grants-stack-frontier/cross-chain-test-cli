import {Vote} from "../types";
import {ethers} from "ethers";
import { AlloAbi } from '@allo-team/allo-v2-sdk';

// Example from the docs
// const generateKLIMATransaction = async (receivedAmount: string) => {
//   const stakeKlimaTx = await new ethers.Contract(
//     KLIMA_STAKING_CONTRACT,
//     KLIMA_STAKING_ABI
//   ).populateTransaction.stake(receivedAmount);
//   return stakeKlimaTx;
// };

export default async function (vote: Vote) {
  const address = '0xA9e9110fe3B4B169b2CA0e8825C7CE76EB0b9438';

  const tx = await new ethers.Contract(
    address,
    AlloAbi).populateTransaction.allocate();

  return { tx, vote };
}