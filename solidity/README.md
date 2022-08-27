[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# rNFT iExec CertificateDApp Smart contract

## Overview

Solidity smart contract for [rNFT iExec CertificateDApp](https://github.com/realNFT/rNFT-iExec-CertificateDApp).

`example` explanation

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

**rNFT iExec CertificateDApp** is released under the [MIT](LICENSE).
