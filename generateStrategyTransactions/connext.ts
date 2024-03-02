import { BigNumber, ethers } from "ethers";
import { VoteWithChains } from "../types";
import { create, SdkConfig } from "@connext/sdk";
import { wallet } from "../utils/ethers";
import { getTokenForChain, tenderlyRpcUrl } from "../utils/constants";

export const getConnextDomain = (chainId: number) => {
  switch (chainId) {
    case 1:
      // Mainnet
      return "6648936";
    case 10:
      // Optimism
      return "1869640809";
    case 137:
      // Polygon
      return "1886350457";
    case 42161:
      // Arbitrum
      return "1634886255";
    default:
      throw new Error(`ChainId ${chainId} not supported`);
  }
};

export const sdkConfig: SdkConfig = {
  signerAddress: wallet.address,
  network: "mainnet",
  logLevel: "error",
  chains: {
    [getConnextDomain(1)]: {
      // providers: ["https://eth.llamarpc.com"],
      providers: [tenderlyRpcUrl],
    },
    [getConnextDomain(10)]: {
      providers: [tenderlyRpcUrl],
      // providers: ["https://mainnet.optimism.io"],
    },
    [getConnextDomain(137)]: {
      providers: [tenderlyRpcUrl],
      // providers: ["https://polygon-rpc.com"],
    },
    [getConnextDomain(42161)]: {
      providers: [tenderlyRpcUrl],
      // providers: ["https://arb1.arbitrum.io/rpc"],
    },
  },
};

export async function generateConnextTransaction(
  tx: ethers.PopulatedTransaction,
  vote: VoteWithChains,
) {
  const { sdkBase } = await create(sdkConfig);
  const signerAddress = await wallet.getAddress();

  // xcall parameters
  const originDomain = getConnextDomain(vote.fromChain);
  const destinationDomain = getConnextDomain(vote.toChain);
  const originAsset = vote.token;
  const amount = ethers.utils.parseUnits("10", 6).toString();
  const slippage = "10000";

  // Estimate the relayer fee
  const relayerFee = (
    await sdkBase.estimateRelayerFee({
      originDomain,
      destinationDomain,
    })
  ).toString();

  // Prepare the xcall params
  const xcallParams = {
    origin: originDomain, // send from Goerli
    destination: destinationDomain, // to Mumbai
    to: tx.to, // the address that should receive the funds on destination
    asset: originAsset, // address of the token contract
    delegate: signerAddress, // address allowed to execute transaction on destination side in addition to relayers
    amount: amount, // amount of tokens to transfer
    slippage: slippage, // the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
    callData: tx.data, // empty calldata for a simple transfer (byte-encoded)
    relayerFee: relayerFee, // fee paid to relayers
  };

  // Send the xcall
  const xcallTxReq = await sdkBase.xcall(xcallParams);
  xcallTxReq.gasLimit = BigNumber.from("20000000");
  return {
    request: {
      fromChain: vote.fromChain,
      fromToken: vote.token,
      fromAddress: signerAddress,
      toChain: vote.toChain,
      toToken: getTokenForChain(vote.toChain, "connext"),
      toAmount: amount,
      contractCalls: [
        {
          fromAmount: amount,
          fromTokenAddress: vote.fromChain,
          toContractAddress: tx.to,
          toContractCallData: tx.data,
          toContractGasLimit: "90000",
        },
      ],
    },
    quote: { transactionRequest: xcallTxReq },
    costs: {
      feeCosts: relayerFee,
      gasCosts: 0,
    },
  };
}
