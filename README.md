[![Actions Status](https://github.com/realNFT/rNFT-iExec-CertificateDApp/actions/workflows/solidity.yml/badge.svg)](https://github.com/realNFT/rNFT-iExec-CertificateDApp/actions)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
# rNFT-iExec-CertificateDApp

dApp where users can create an edition certificate of their NFT and corresponding oracle to trigger OpenSea API.

## Overview

Nuxt SSR application for [rNFT iExec CertificateDApp](/).

Hardhat repository with all iExec Oracle contract are in [`solidity/`](/solidity) folder.

1. Thanks to frontend, users can ask to register NFT through a smart contract address and a tokenId
2. If the API call (https://api.nftport.xyz/v0/nfts/{contract_address}/{token_id}) verification return a non null address, then the backend create thanks to [iexec-oracle-factory-wrapper](https://github.com/iExecBlockchainComputing/iexec-oracle-factory-wrapper) the oracle and push the Oracle Id into the smart contract [`solidity/contracts/CertificateMint.sol`](/solidity/contracts/CertificateMint.sol)
3. When it is done, the user can connect on iExec blockchain to mint a repoduction certificate. If he is the NFT owner on the Ethereum mainchain according to the iExec Oracle.


## Summary : 
1. Oracle creation
2. Certificate mint
3. Wallet connect

## Pages details

1. Oracle - All users :
	
- [x] One form to fetch opensea URL of the NFT
- [x] Test API Call
- [x] Validation button 
	
	
2. Certificate - Logged users : 
- [x] Select all mint choices for one NFT
- [x] If Oracle doesn't exists, create one
- [x] Mint the NFT

- [ ] Deploy on Github Page

## Solidity

- [x] Write smart contracts
- [x] Tests with 100% coverage
- [x] Workflows 

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).


## 📄 License

**rNFT iExec CertificateDApp** is released under the [MIT](LICENSE).
