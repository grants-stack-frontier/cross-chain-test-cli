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

export const storeResultsOnline = process.env.STORE_RESULTS_ONLINE === "true";
export const USDCe_ON_OP = "0x7f5c764cbc14f9669b88837ca1490cca17c31607";
export const USDC_ON_OP = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
export const USDC_ON_POL = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
