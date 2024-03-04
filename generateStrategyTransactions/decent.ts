import {
  ActionType,
  BoxActionRequest,
  BoxActionResponse,
} from "@decent.xyz/box-common";
import { VoteWithChains } from "../types";
import { ethers } from "ethers";
import { decentApiKey } from "../utils/constants";

export const bigintSerializer = (key: string, value: unknown): unknown => {
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }

  return value;
};

export const bigintDeserializer = (key: string, value: unknown): unknown => {
  if (typeof value === "string" && /^-?\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }

  return value;
};

export async function generateDecentTransaction(
  tx: ethers.PopulatedTransaction,
  vote: VoteWithChains,
) {
  const req: BoxActionRequest = {
    srcChainId: vote.fromChain,
    dstChainId: vote.toChain,
    srcToken: vote.token,
    dstToken: vote.token,
    slippage: 0,
    actionType: "arbitrary-evm-action" as ActionType,
    actionConfig: {
      chainId: vote.toChain,
      contractAddress: vote.roundAddress,
      signature: "allocate(uint256 poolId, bytes data)",
      args: [1, ""],
    },
    sender: vote.voter,
  };
  // if (account) {
  //   req = await createBoxActionRequest(account, apiTest);
  // }
  console.log("Req", req);

  const url = `https://box-v1.api.decent.xyz/api/getBoxAction?arguments=${JSON.stringify(
    req,
    bigintSerializer,
  )}`;
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": decentApiKey,
      },
    });
    const data = await response.text();

    const actionResponse: BoxActionResponse = JSON.parse(
      data,
      bigintDeserializer,
    );
    console.log("actionResponse", actionResponse);
    return {
      quote: {
        transactionRequest: actionResponse.tx,
      },
      costs: {
        feeCosts: actionResponse.applicationFee?.amount || 0,
      },
    };
  } catch (e) {
    console.error("Error getting response", e);
    return {
      config: null,
      response: null,
    };
  }
}
