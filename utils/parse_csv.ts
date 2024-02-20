import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import * as fs from "fs";

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

  return rows.map(row => {
    return row.reduce((acc, cell, index) => {
      const key = headers[index].trim();
      acc[key] = cell;
      return acc;
    }, {} as Record<string, string>);
  });
};