import { prepareConnext } from "./connext";

export const prepareStrategy = async (strategy: string) => {
  console.log(`Preparing strategy: ${strategy}`);
  switch (strategy) {
    case "lifi":
      return "lifi";
    case "connext":
      await prepareConnext();
      return "connext";
    default:
      throw new Error(`Strategy ${strategy} not implemented`);
  }
};
