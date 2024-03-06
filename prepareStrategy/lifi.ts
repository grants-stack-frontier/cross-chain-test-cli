import { getRpcUrl, getTokenForChain, lifiDiamond } from "../utils/constants";
import { wallet } from "../utils/ethers";
import { ethers } from "ethers";

export const prepareLifi = async (chainId: number) => {
  if (chainId === 42161) {
    console.log("Preparing lifi allowance for arbitrum");
    const token = getTokenForChain(chainId, "lifi");
    const walletWithProvider = wallet.connect(
      new ethers.providers.JsonRpcProvider(getRpcUrl(chainId)),
    );
    const contract = new ethers.Contract(
      token,
      ["function approve(address,uint256)"],
      walletWithProvider,
    );
    const amount = ethers.utils.parseUnits("10").toString();
    const tx = await contract.approve(lifiDiamond, amount);
    await tx.wait();
    console.log("Allowance set");
  }
};
