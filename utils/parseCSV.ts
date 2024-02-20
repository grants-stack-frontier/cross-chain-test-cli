import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import * as fs from "fs";
import {BigNumber} from "ethers";

import {Vote} from "../types";

// Read and process the CSV file
export const processFile = async (fileName: string) => {
  const records: string[][] = [];
  const parser = fs
    .createReadStream(`${fileName}`)
    .pipe(parse({
      // CSV options if any
    }));
  parser.on('readable', function(){
    let record: string[]; while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  const [headers, ...rows] = records;

  return  rows.map(row => {
    return row.reduce((acc, cell, index) => {
      const key = headers[index].trim();
      acc[key] = cell;
      return acc;
    }, {} as Record<string, string>);
  }).map(typeVote);
};

const typeVote = (vote: Record<string, string>): Vote => {
  return {
    chain_id: parseInt(vote.chain_id),
    voter: vote.voter,
    amount: BigNumber.from(vote.amount),
    token: vote.token,
    amountUSD: parseFloat(vote.amountUSD),
    payoutAddress: vote.payoutAddress,
    round_name: vote.round_name,
    roundAddress: vote.roundAddress,
    tx_gasPrice: BigNumber.from(vote.tx_gasPrice),
    tx_gasSpent: BigNumber.from(vote.tx_gasSpent),
    tx_timestamp: new Date(vote.tx_timestamp),
  }
}
