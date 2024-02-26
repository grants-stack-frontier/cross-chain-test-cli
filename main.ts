import { processFile } from "./utils/parseCSV";
import { calculateDistribution } from "./calculateDistribution";
import { populateAllocateTransaction } from "./populateAllocateTransaction";
import { generateStrategyTransactions } from "./generateStrategyTransactions";
import * as dotenv from "dotenv";

dotenv.config();

// Full ABI on
// https://polygonscan.com/address/0x4D70a031Fc76DA6a9bC0C922101A05FA95c3A227#code
const KLIMA_STAKING_ABI = ["function stake(uint _amount) external"];

const filePath = "example_votes.csv";

async function main() {
  console.log(process.env.TENDERLY_ACCESS_KEY);
  // Parse votes from CSV
  const parsedVotes = await processFile(filePath);

  // Calculate distribution across chains
  const { votes, targetChain } = calculateDistribution(parsedVotes, "default");

  // Create voting transactions
  const allocateTransactions = await Promise.all(
    votes.map((vote) => populateAllocateTransaction("QVSimple", vote)),
  );

  const quotes = await Promise.all(
    allocateTransactions.map((allocateTx) =>
      generateStrategyTransactions("lifi", allocateTx.tx, allocateTx.vote),
    ),
  );

  console.log(quotes);

  // Get quote
  // getQuote().then(console.log);
}

main();
