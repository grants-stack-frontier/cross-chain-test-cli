import { wallet } from "./utils/ethers";
import { tenderlyRpcUrl } from "./utils/constants";
import { ethers } from "ethers";

export const simulateTransaction = async (tx: any) => {
  const provider = new ethers.providers.JsonRpcProvider(tenderlyRpcUrl);

  const signer = wallet.connect(provider);
  const transaction = await signer.sendTransaction(tx);

  return transaction;
};
