import { ethers } from "ethers";

export const wallet = ethers.Wallet.fromMnemonic(
  "test test test test test test test test test test test junk",
);

console.log(wallet.address);