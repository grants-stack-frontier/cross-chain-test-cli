import { Vote } from "../types";
import { ethers, Wallet } from "ethers";
import {
  AlloAbi,
  DonationVotingMerkleDistributionStrategy,
} from "@allo-team/allo-v2-sdk";
import {
  AllowanceProvider,
  PERMIT2_ADDRESS,
  SignatureTransfer,
  PermitTransferFrom,
} from "@uniswap/permit2-sdk";
import { toMs } from "ms-typescript";

const PERMIT_EXPIRATION = toMs("30d");
const PERMIT_SIG_EXPIRATION = toMs("30m");

/**
 * Converts an expiration (in milliseconds) to a deadline (in seconds) suitable for the EVM.
 * Permit2 expresses expirations as deadlines, but JavaScript usually uses milliseconds,
 * so this is provided as a convenience function.
 */
function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000);
}

// Example from the docs
// const generateKLIMATransaction = async (receivedAmount: string) => {
//   const stakeKlimaTx = await new ethers.Contract(
//     KLIMA_STAKING_CONTRACT,
//     KLIMA_STAKING_ABI
//   ).populateTransaction.stake(receivedAmount);
//   return stakeKlimaTx;
// };

const getPermitData = async (vote: Vote) => {
  const wallet = ethers.Wallet.createRandom();
  const provider = new ethers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    10,
    // "https://bsc-dataseed.binance.org/",
  );
  const signer = new Wallet(wallet.privateKey, provider);
  // @ts-ignore
  const allowanceProvider = new AllowanceProvider(provider, PERMIT2_ADDRESS);
  const {
    amount: permitAmount,
    expiration,
    nonce,
  } = await allowanceProvider.getAllowanceData(
    vote.token,
    wallet.address,
    vote.roundAddress,
  );

  const permitSingle: PermitTransferFrom = {
    spender: vote.voter,
    nonce,
    permitted: {
      amount: permitAmount,
      token: vote.token,
    },
    deadline: expiration,
  };

  const { domain, types, values } = SignatureTransfer.getPermitData(
    permitSingle,
    PERMIT2_ADDRESS,
    vote.chain_id,
  );

  // We use an ethers signer to sign this data:
  // @ts-ignore
  const signature = await signer.signTypedData(domain, types, values);
  return { signature, permit: permitSingle };
};

export default async function (vote: Vote) {
  const permit2Data = await getPermitData(vote);
  console.log(permit2Data);

  const strategy = new DonationVotingMerkleDistributionStrategy({
    chain: vote.chain_id,
    poolId: 1,
    rpc: "https://bsc-dataseed.binance.org/",
    address: vote.roundAddress,
  });

  const encodedAllocation = strategy.getEncodedAllocation({
    recipientId: vote.payoutAddress,
    // @ts-ignore
    permit2Data,
  });

  console.log(permit2Data);
  const address = "0xA9e9110fe3B4B169b2CA0e8825C7CE76EB0b9438";
  //
  //
  const tx = await new ethers.Contract(
    address,
    AlloAbi,
  ).allocate.populateTransaction(encodedAllocation);
  //
  //
  // const tx = await new ethers.Contract(
  //   address,
  //   AlloAbi,
  // ).populateTransaction.allocate(encodedAllocation);

  return { tx, vote };
}
