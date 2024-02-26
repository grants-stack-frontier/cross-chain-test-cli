import { Vote } from "../types";
import { ethers, Wallet } from "ethers";
import { AlloAbi } from "@allo-team/allo-v2-sdk";
import {
  AllowanceProvider,
  PERMIT2_ADDRESS,
  PermitTransferFrom,
  SignatureTransfer,
} from "@uniswap/permit2-sdk";
import { encodeAbiParameters, parseAbiParameters } from "viem";

const POOL_ID = 1;

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
  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/",
  );
  const signer = new Wallet(wallet.privateKey, provider);
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
  const signature = await signer._signTypedData(domain, types, values);
  return { signature, permit: permitSingle };
};

function getEncodedAllocation(data: any): `0x${string}` {
  return encodeAbiParameters(
    parseAbiParameters(
      "address, (((address, uint256), uint256, uint256), bytes)",
    ),
    [
      data.recipientId,
      [
        [
          [
            data.permit2Data.permit.permitted.token,
            data.permit2Data.permit.permitted.amount,
          ],
          data.permit2Data.permit.nonce,
          data.permit2Data.permit.deadline,
        ],
        data.permit2Data.signature,
      ],
    ],
  );
}

export default async function (vote: Vote) {
  const permit2Data = await getPermitData(vote);

  const encodedAllocation = getEncodedAllocation({
    recipientId: vote.payoutAddress,
    // @ts-ignore
    permit2Data,
  });

  const address = "0xA9e9110fe3B4B169b2CA0e8825C7CE76EB0b9438";

  const tx = await new ethers.Contract(
    address,
    AlloAbi,
  ).populateTransaction.allocate(POOL_ID, encodedAllocation);

  return { tx, vote };
}
