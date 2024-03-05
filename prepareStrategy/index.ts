import { prepareConnext } from "./connext";

export const prepareStrategy = async (strategy: string, chainId: number) => {
  console.log(`Preparing strategy: ${strategy}`);
  switch (strategy) {
    case "decent":
    case "lifi":
      return;
    case "connext":
      await prepareConnext(chainId);
      return;
    default:
      throw new Error(`Strategy ${strategy} not implemented`);
  }
};
