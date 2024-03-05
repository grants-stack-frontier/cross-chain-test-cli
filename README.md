# Cross chain testing utitlity

### Introduction
This utility is designed to simulate cross chain transactions. It reads in a CSV file
with transaction data and uses the data to simulate allocate transactions on the blockchain.

It is built to be easily extendable to support new chains, 
transaction types and crosschain strategies.

### Getting started
1. Install the required packages `yarn install`
2. Create a fork with it's own RPC (we recommend tenderly for a good developer experience) for each chain that needs to be tested
3. Setup env vars by renaming/copying `.env.template` to `.env` and filling in the required values
4. Start the interactive CLI utility with `yarn start`

### Testing data
The utility will read in the `example_votes.csv` file and use the data to simulate transactions on the blockchain. The file should be in the following format:
```
chain_id,voter,amount,token,amountUSD,payoutAddress,round_name,roundAddress,tx_gasPrice,tx_gasSpent,tx_timestamp
```

### Currently supported chains
- Optimism
- Polygon