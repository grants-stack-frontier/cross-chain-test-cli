import fs from "fs";
import { stringify } from "csv-stringify";

export const writableStream = (filename: string) =>
  fs.createWriteStream(filename);

export const stringifier = ({
  header = true,
  columns,
}: {
  header: boolean;
  columns: string[];
}) => stringify({ header, columns });

export const writeToCSV = ({
  fileName,
  data,
  columns,
}: {
  fileName: string;
  data: any[];
  columns: string[];
}) => {
  const stringifierInstance = stringifier({ header: true, columns });
  const writable = writableStream(fileName);
  stringifierInstance.pipe(writable);
  data.forEach((d) => stringifierInstance.write(d));
  stringifierInstance.end();

  console.log(`Wrote to ${fileName}`);
};
