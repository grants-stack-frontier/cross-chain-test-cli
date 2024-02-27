import { Tenderly, Network } from "@tenderly/sdk";
import {
  tenderlyAccessKey,
  tenderlyAccountName,
  tenderlyProjectName,
} from "./constants";

export const tenderlyInstance = new Tenderly({
  accountName: tenderlyAccountName,
  projectName: tenderlyProjectName,
  accessKey: tenderlyAccessKey,
  network: Network.POLYGON, // Replace with the appropriate network
});
