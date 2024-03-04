import { wallet } from "./utils/ethers";
import { getRpcUrl } from "./utils/constants";
import { ethers } from "ethers";

export const simulateTransaction = async (tx: any, chainId: number) => {
  const provider = new ethers.providers.JsonRpcProvider(getRpcUrl(chainId));

  const signer = wallet.connect(provider);
  const transaction = await signer.sendTransaction(tx);

  return transaction;
};
