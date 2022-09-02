[![Actions Status](https://github.com/realNFT/rNFT-iExec-CertificateDApp/actions/workflows/solidity.yml/badge.svg)](https://github.com/realNFT/rNFT-iExec-CertificateDApp/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# rNFT iExec CertificateDApp Smart contract

## Overview

Solidity smart contract for [rNFT iExec CertificateDApp](/). 

1. Thanks to frontend, users can ask to register NFT through a smart contract address and a tokenId
2. If the API call verification return a positive value, then the backend create thanks to [iexec-oracle-factory-wrapper](https://github.com/iExecBlockchainComputing/iexec-oracle-factory-wrapper) the oracle and push the Oracle Id into the smart contract
3. When it is done, the user can connect on iExec blockchain to mint a repoduction certificate. If he is the NFT owner on the Ethereum mainchain according to the iExec Oracle.

## Contracts

`IOracle` contract represent the interface iExec Oracle contract
`CertificateMint` store oracles id of different NFTs and mint reproduction certificate
`MockCertificateMint` is used only for test purpose

### 📦 Installation

```console
$ npm i
```

### ⛏️ Compile

```console
$ npm run compile
```

This task will compile all smart contracts in the `contracts` directory.
ABI files will be automatically exported in `build/abi` directory.

### 📚 Documentation

Documentation is auto-generated after each build in [`docs`](https://github.com/realNFT/rNFT-iExec-CertificateDApp/tree/main/solidity/docs) directory.

The generated output is a static website containing smart contract documentation.

### 🌡️ Testing

```console
$ yarn test
```

### 📊 Code coverage

```console
$ npm run coverage
```

The report will be printed in the console and a static website containing full report will be generated in [`coverage`](https://github.com/realNFT/rNFT-iExec-CertificateDApp/tree/main/solidity/coverage) directory.

### ✨ Code style

```console
$ npm run prettier
```

### 🐱‍💻 Verify & Publish contract source code

```console
$ npx hardhat  verify --network mainnet $CONTRACT_ADDRESS $CONSTRUCTOR_ARGUMENTS
```

## 📄 License

**rNFT iExec CertificateDApp Solidity contracts** is released under the [MIT](LICENSE).
