import { create } from "@connext/sdk";
import {
  getConnextDomain,
  sdkConfig,
} from "../generateStrategyTransactions/connext";
import { wallet } from "../utils/ethers";
import { BigNumber, ethers } from "ethers";
import { tenderlyRpcUrl, USDCe_ON_OP } from "../utils/constants";

export const prepareConnext = async () => {
  const { sdkBase } = await create(sdkConfig);

  const originDomain = getConnextDomain(10);
  const originAsset = USDCe_ON_OP;
  const amount = ethers.utils.parseUnits("10", 6).toString();

  // Approve the asset transfer if the current allowance is lower than the amount.
  // Necessary because funds will first be sent to the Connext contract in xcall.
  const approveTxReq = await sdkBase.approveIfNeeded(
    originDomain,
    originAsset,
    amount,
    true,
  );

  if (approveTxReq) {
    console.log("Setting approval for connext");
    const walletWithProvider = wallet.connect(
      new ethers.providers.JsonRpcProvider(tenderlyRpcUrl),
    );
    approveTxReq.gasLimit = BigNumber.from("20000000");
    // console.log(wallet.provider, walletWithProvider.provider);
    const approveTxReceipt =
      await walletWithProvider.sendTransaction(approveTxReq);
    await approveTxReceipt.wait();
    console.log("Approval for connext set successfully");
  } else {
    console.log("Approval already set");
  }
};
