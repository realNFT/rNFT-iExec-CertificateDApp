[![Actions Status](https://github.com/realNFT/rNFT-iExec-CertificateDApp/workflows/solidity/badge.svg)](https://github.com/realNFT/rNFT-iExec-CertificateDApp/actions)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
# rNFT-iExec-CertificateDApp

dApp where users can create an edition certificate of their NFT and corresponding oracle to trigger OpenSea API.

Two major features will be available:
- Create an oracle on iExec (if not already existing) of the last price available via the opensea API wich can be trigged by anyone.
- Mint an edition certificate by the owner of the NFT (creation of an oracle at the same time if it does not exist).

Hardhat repository with all iExec Oracle contract are in [`solidity/`]("https://github.com/realNFT/rNFT-iExec-CertificateDApp/tree/main/solidity") folder.

# Nuxt Frontend
## Summary : 
1. Oracle creation
2. Certificate mint
3. Wallet connect

## Pages details

1. Oracle - All users :
	
- [ ] One form to fetch opensea URL of the NFT
- [ ] Print NFT information
- [ ] Validation button 
	
	
2. Certificate - Logged users : 
- [ ] List of all NFTs on the owner wallet
- [ ] One NFT selection
- [ ] If Oracle doesn't exists, create one
- [ ] Print all Certificate information


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