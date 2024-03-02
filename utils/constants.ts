import { assertExists } from "./assertExists";

export const tenderlyProjectName = assertExists(
  process.env.TENDERLY_PROJECT_NAME,
  "TENDERLY_PROJECT_NAME",
);

export const tenderlyAccessKey = assertExists(
  process.env.TENDERLY_ACCESS_KEY,
  "TENDERLY_ACCESS_KEY",
);

export const tenderlyAccountName = assertExists(
  process.env.TENDERLY_ACCOUNT_NAME,
  "TENDERLY_ACCOUNT_NAME",
);

export const tenderlyApiUrl = assertExists(
  process.env.TENDERLY_API_URL,
  "TENDERLY_API_URL",
);

export const lifiDiamond = "0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE";

export const tenderlyRpcUrl = assertExists(
  process.env.TENDERLY_FORK_RPC,
  "TENDERLY_FORK_RPC",
);

export const sheetBestUrl = assertExists(
  process.env.SHEET_BEST_URL,
  "SHEET_BEST_URL",
);

export const USDCe_ON_OP = "0x7f5c764cbc14f9669b88837ca1490cca17c31607";
export const USDC_ON_OP = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
export const USDC_ON_POL = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

export const ALLO_ADDRESS = "0x1133eA7Af70876e64665ecD07C0A0476d09465a1";
export const MOCK_ALLO_ADDRESS = "0xfB1eD3Fe2978c8aCf1cBA19145D7349A4730EfAd";

export const getTokenForChain = (chainId: number, strategy: string) => {
  switch (chainId) {
    case 10:
      // if (strategy === "connext") {
      return USDCe_ON_OP;
    // }
    // return USDC_ON_OP;
    case 137:
      return USDC_ON_POL;
    default:
      throw new Error(`ChainId ${chainId} not supported`);
  }
};
