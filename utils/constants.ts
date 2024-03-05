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
  process.env.TENDERLY_OPTIMISM_RPC_URL,
  "TENDERLY_FORK_RPC",
);

export const tenderlyPolygonRpcUrl = assertExists(
  process.env.TENDERLY_POLYGON_RPC_URL,
  "TENDERLY_POLYGON_RPC_URL",
);

export const tenderlyArbitrumRpcUrl = assertExists(
  process.env.TENDERLY_ARBITRUM_RPC_URL,
  "TENDERLY_ARBITRUM_RPC_URL",
);

export const getRpcUrl = (chainId: number) => {
  switch (chainId) {
    case 10:
      return tenderlyRpcUrl;
    case 137:
      return tenderlyPolygonRpcUrl;
    case 42161:
      return tenderlyArbitrumRpcUrl;
    default:
      throw new Error(`ChainId ${chainId} not supported`);
  }
};

export const sheetBestUrl = assertExists(
  process.env.SHEET_BEST_URL,
  "SHEET_BEST_URL",
);

export const decentApiKey = assertExists(
  process.env.DECENT_API_KEY,
  "DECENT_API_KEY",
);

export const USDCe_ON_OP = "0x7f5c764cbc14f9669b88837ca1490cca17c31607";
export const USDC_ON_OP = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
export const USDC_ON_POL = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const USDC_ON_AR = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const USDCe_ON_AR = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8";

export const ALLO_ADDRESS = "0x1133eA7Af70876e64665ecD07C0A0476d09465a1";

const MOCK_ALLO_OPTIMISM_ADDRESS = "0xfB1eD3Fe2978c8aCf1cBA19145D7349A4730EfAd";
const MOCK_ALLO_ARBITRUM_ADDRESS = "0x0a0DF97bDdb36eeF95fef089A4aEb7acEaBF2101";
const ARBITRUM_CROSSCHAIN_ADAPTER =
  "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941";
const MOCK_ALLO_POLYGON_ADDRESS = "0x0a0DF97bDdb36eeF95fef089A4aEb7acEaBF2101";
const POLYGON_CROSSCHAIN_ADAPTER = "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941";

export const getMockAlloContractAddress = (chainId: number) => {
  switch (chainId) {
    case 10:
      return MOCK_ALLO_OPTIMISM_ADDRESS;
    case 42161:
      return MOCK_ALLO_ARBITRUM_ADDRESS;
    case 137:
      return MOCK_ALLO_POLYGON_ADDRESS;
    default:
      throw new Error(`ChainId ${chainId} not supported`);
  }
};

export const getTokenForChain = (chainId: number, strategy: string) => {
  switch (chainId) {
    case 10:
      if (strategy === "connext") {
        return USDCe_ON_OP;
      }
      return USDC_ON_OP;
    case 137:
      return USDC_ON_POL;
    case 42161:
      if (strategy === "connext") {
        return USDCe_ON_AR;
      }
      return USDC_ON_AR;
    default:
      throw new Error(`ChainId ${chainId} not supported`);
  }
};
