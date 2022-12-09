/**
 * This extracts the mint account field from a metaboss snapshot holders call.
 * The file path to <METABOSS_SNAPSHOT_HOLDERS_FILE> should be a json file
 * for use with air-support. It writes to the token-mint-addresses.json file.
 * The token-mint-addresses.json file is consumed by the <make record> command
 *
 * @todo add command line arguments
 * --file should point to the METABOSS_SNAPSHOT_HOLDERS_FILE
 * --out should be a valid filepath to write the output file to
 *
 */

var fs = require("fs");
var path = require("path");
const { exit } = require("process");

console.log("Running in " + __dirname);
const TOKEN_MINT_ADDRESSES_FILE = "air-support/token-mint-addresses.json";
const METABOSS_SNAPSHOT_HOLDERS_FILE =
  "vanth-snapshot-output/27ZpfB1LjKffW7B2f8KbdiNqhaVbB5UEcpmBfTxvLCLK_holders.json";

if (!fs.existsSync(METABOSS_SNAPSHOT_HOLDERS_FILE)) {
  throw Error("File does not exist");
}

const fileContents = require(path.join(
  path.dirname(__filename),
  METABOSS_SNAPSHOT_HOLDERS_FILE
));

let mintAddresses = [];

// collect the mint accounts, aka the token addresses
fileContents.forEach((obj) => {
  if (!obj.mint_account)
    throw Error("Snapshot file incorrectly formatted. No mint account.");
  mintAddresses.push(obj.mint_account);
});

const writeStream = fs.createWriteStream(TOKEN_MINT_ADDRESSES_FILE);
const pathName = writeStream.path;

console.log(JSON.stringify(mintAddresses));
// write each value of the array to json
writeStream.write(JSON.stringify(mintAddresses));

// the finish event is emitted when all data has been flushed from the stream
writeStream.on("finish", () => {
  console.log(
    `Wrote data ${mintAddresses.length} token addresses to file ${path.join(
      path.dirname(__filename),
      pathName
    )}`
  );
});

// handle the errors on the write process
writeStream.on("error", (err) => {
  console.error(`There is an error writing the file ${pathName} => ${err}`);
});

// close the stream
writeStream.end();
