import { processFile } from "./utils/parseCSV";
import { calculateDistribution } from "./calculateDistribution";
import { populateTransaction } from "./populateTransaction";
import { generateStrategyTransactions } from "./generateStrategyTransactions";
import * as dotenv from "dotenv";
import { simulateTransaction } from "./simulateTransaction";
import { writeToCSV } from "./utils/writeCSV";
import axios from "axios";
import { sheetBestUrl, storeResultsOnline } from "./utils/constants";
import { prepareStrategy } from "./prepareStrategy";
import { processLifiSimulateTransaction } from "./processSimulation/lifi";
import { processConnextSimulateTransaction } from "./processSimulation/connext";

dotenv.config();

const filePath = "example_votes.csv";

async function main() {
  const strategy: string = "connext";
  const transactionType = "allocate";

  // Parse votes from CSV
  const parsedVotes = await processFile(filePath);

  // Calculate distribution across chains
  const { votes, targetChain } = calculateDistribution(parsedVotes, "default");

  console.log(`Found ${votes.length} votes for ${targetChain} chains.`);
  // Create voting transactions
  const allocateTransactions = await Promise.all(
    votes.map((vote) => populateTransaction(transactionType, vote)),
  ).then((txs) => txs.filter((tx) => tx !== null));

  console.log(`Generated ${allocateTransactions.length} transactions.`);

  // Prepare strategy (set allowances etc)
  await prepareStrategy(strategy);

  const quotes = await Promise.all(
    allocateTransactions
      .map((allocateTx) =>
        generateStrategyTransactions(strategy, allocateTx.tx, allocateTx.vote),
      )
      .filter((tx) => tx !== null),
  );

  console.log(`Received ${quotes.length} quotes.`);

  const simulations = await Promise.all(
    quotes.map(({ quote }) => simulateTransaction(quote.transactionRequest)),
  );

  console.log(`Simulated ${simulations.length} transactions.`);

  // write to CSV
  const columns = [
    "txHash",
    "fromChain",
    "fromTokenAddress",
    "fromTokenAmount",
    "toChain",
    "toTokenAddress",
    "toTokenAmount",
    "gasPrice",
    "totalCostUSD",
    "createdAt",
    "transactionType",
    "strategy",
  ];

  // txHash = simulation.hash
  // fromChain = quotes.request.fromChain
  // fromTokenAddress = quotes.request.fromTokenAddress
  // fromTokenAmount = quotes.request.fromAmount
  // toChain = quotes.request.toChain
  // toTokenAddress = quotes.request.toToken
  // toTokenAmount = quotes.request.toAmount
  // gasPrice = simulation.gasPrice
  // value = simulation.value
  // totalCostUSD = quotes.costs.feeCosts + quotes.costs.gasCosts

  // const data = simulations.map((simulation, index) => {
  //   const quote = quotes[index].request;
  //
  //   console.log(quotes[index].costs);
  //   const totalCost =
  //     Number(quotes[index].costs.feeCosts) +
  //     Number(quotes[index].costs.gasCosts);
  //
  //   return [
  //     simulation.hash,
  //     quote.fromChain,
  //     quote.contractCalls[0].fromTokenAddress,
  //     quote.contractCalls[0].fromAmount,
  //     quote.toChain,
  //     quote.toToken,
  //     quote.toAmount,
  //     simulation.gasPrice,
  //     simulation.value.toString(),
  //     totalCost,
  //   ];
  // });

  const createdAt = new Date().toISOString();
  const results = await Promise.all(
    simulations.map((simulation, index) => {
      switch (strategy) {
        case "lifi":
          return processLifiSimulateTransaction(simulation, quotes[index]);
        case "connext":
          return processConnextSimulateTransaction(simulation, quotes[index]);
        default:
          throw new Error(`Strategy ${strategy} not implemented`);
      }
    }),
  ).then((res) => res.map((x) => ({ ...x, createdAt, transactionType })));

  // Write to CSV
  writeToCSV({
    fileName: "output.csv",
    data: results.map((x) => Object.values(x)),
    columns,
  });
  if (storeResultsOnline) {
    console.log("Storing results in google sheet...");
    await axios.post(sheetBestUrl, results);
  }
}

main();
