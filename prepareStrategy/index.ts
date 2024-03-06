import { prepareConnext } from "./connext";
import { prepareLifi } from "./lifi";

export const prepareStrategy = async (strategy: string, chainId: number) => {
  console.log(`Preparing strategy: ${strategy}`);
  switch (strategy) {
    case "decent":
      return;
    case "lifi":
      await prepareLifi(chainId);
      return;
    case "connext":
      await prepareConnext(chainId);
      return;
    default:
      throw new Error(`Strategy ${strategy} not implemented`);
  }
};
