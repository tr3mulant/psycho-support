# Setup

1. Read the docs for Air Support, Metaboss, and Metaplex. You'll need Rust, the Solana CLI, and some other libs.

2. Run the yarn script to install the main dependencies. This installs Air Support, Metaboss, and Metaplex

```
yarn install-dependencies
```

This will install a tweaked version of Air Support, the latest version of Metaboss, and an ancient version of Metaplex (v1.0.0).

# If a wallet is already in possesion of minted NFTs to airdrop to holders.

## Follow the steps to perform an airdrop

1. Generate a list of holders using the [Metaboss tool](https://github.com/samuelvanderwaal/metaboss). The `--creator` flag is the creator address, `-p` flag indicates the index in the creators struct to verify against, and `--output` points to a log directory to write the output file to. I'm sure there is another way to do this without bringing in another library but this is what was landed on due to time crunch.

   ```
   metaboss -T 600 snapshot holders --creator 27ZpfB1LjKffW7B2f8KbdiNqhaVbB5UEcpmBfTxvLCLK -p 0 --output vanth-snapshot-output
   ```

2. Run a custom script to extract the Mint Accounts, aka the Token Address, from step 1. Writes file to `air-support/token-mint-addresses.json`

   ```
   node extractMintAccountFromMetabossSnapshot.js
   ```

3. Run [Skeleton Crew Air-Support](https://github.com/theskeletoncrew/air-support) command. This command logs holders that have the Token from step 2. It filters out holders that are well-known escrow wallets like Magic Eden or Exchange Art. This list could be generated from the Metaboss snapshot holders command using the filter list used by Skeleton Crew. Environment variable `DROP` can be set on the Makefile located at `air-support/Makefile` or used in the example below. A directoy with the drop name will be made in `air-support/airdrops/<DROP>`. Log files for the airdrop are written there.

   ```
   make record DROP=chimpions-01
   ```

   Adding additional known addresses for other marketplaces would be a good idea in `1_record_holders/src/main.ts`

   ```
    const exchangeArtMarket = "BjaNzGdwRcFYeQGfuLYsc1BbaNRG1yxyWs1hZuGRT8J2";
   ```

4. Generate a list of mint addresses for the tokens to airdrop. This command will write to `${airdrop}_mint.log` for use in step 6.

5. Run this command to make and select a number of token owner wallets to receive the airdrop. 2 tokens is twice the chance, 5 tokens it 5 times the chance, etc. Again, the `NUM` environment variable can be set in the Makefile

   ```
   make choose NUM=500
   ```

6. Run this command to make and actually perform the airdrop transactions. You will definitely want to rate limit your calls here or you will find a lot of failed transactions. Use a private RPC as well. Adding a `sleep 10s` after each `spl-token transfer` call in `distribute.sh` worked for me.

   ```
   make distribute
   ```

# A note about the Makefile from the Air Support docs

At minimum, you'll need to specify paths to Metaplex, your keyfile, and an RPC Host. It's highly recommended that you use a third-party RPC provider to perform large airdrops. DROP is a name for a set of airdrops; in our case we numbered these 1-31 for each day in October. TYPE is a name for a single airdropped item that's part of a drop; in our case we had a "trick" and a "treat" as part of each drop, sometimes even "trick1", "trick2"... etc. The name will be "token" by default, and is used to prefix log files in each step below.

# If edition mint is need

Follow the steps in the README.md for Skeleton Crew Air Support

# Improvements

1. Make this a monorepo to manage each package individually or some other big brain move.
2. Update Metaplex to use the latest Rust programs (this might require a bunch of work though). Air Support seems only uses it for the mint phase of the project, so working in the latest Token Metadata mint call might be all that's needed.
3. Additional scripts that generate transaction links via common Solana chain explorers.
4. Auto generate repo to hold transaction history for transparency or some other solution.
5. A GUI would be swell.
