import { Vote } from "../types";
import { ethers } from "ethers";
import { AlloAbi } from "@allo-team/allo-v2-sdk";
import {
  AllowanceProvider,
  PERMIT2_ADDRESS,
  PermitTransferFrom,
  SignatureTransfer,
} from "@uniswap/permit2-sdk";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { wallet } from "../utils/ethers";
import { tenderlyRpcUrl } from "../utils/constants";

const POOL_ID = 1;

/**
 * Converts an expiration (in milliseconds) to a deadline (in seconds) suitable for the EVM.
 * Permit2 expresses expirations as deadlines, but JavaScript usually uses milliseconds,
 * so this is provided as a convenience function.
 */
function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000);
}

const getPermitData = async (vote: Vote) => {
  const provider = new ethers.providers.JsonRpcProvider(
    tenderlyRpcUrl,
    // "https://mainnet.optimism.io",
  );
  const signer = wallet.connect(provider);
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

  // Allo Proxy https://github.com/allo-protocol/allo-v2/tree/main/contracts
  const address = "0x1133eA7Af70876e64665ecD07C0A0476d09465a1";

  const tx = await new ethers.Contract(
    address,
    AlloAbi,
  ).populateTransaction.allocate(POOL_ID, encodedAllocation);

  return { tx, vote };
}
