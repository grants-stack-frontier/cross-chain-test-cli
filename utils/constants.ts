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
