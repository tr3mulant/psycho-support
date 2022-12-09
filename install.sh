#!/bin/bash

current_dir=$PWD
git clone https://github.com/samuelvanderwaal/metaboss metaboss
cd metaboss
git checkout main
cargo build --release
cd $current_dir
git clone https://github.com/tr3mulant/air-support.git air-support
git clone https://github.com/metaplex-foundation/metaplex.git metaplex
cd metaplex
git checkout v1.0.0
cd js
$ yarn install && yarn bootstrap && yarn build
cd ../rust
cargo build
cd $current_dir