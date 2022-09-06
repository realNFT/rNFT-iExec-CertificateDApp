require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-abi-exporter");
require("hardhat-docgen");
require("hardhat-tracer");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("dotenv").config();

const etherscanApiKey = getEtherscanApiKey();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1,
      accounts: {
        accountsBalance: "10000000000000000000000000",
      },
    },
    mainnet: mainnetNetworkConfig(),
    goerli: goerliNetworkConfig(),
    vivani: iExecVivaniNetworkConfig(),
    bellecour: iExecBellecourNetworkConfig(),
  },
  abiExporter: {
    path: "./build/abi",
    clear: true,
    flat: true,
    spacing: 2,
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true,
  },
  gasReporter: {
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      apiKey: ""
    },
    customChains: [
      {
        network: "bellecour",
        chainId: 134,
        urls: {
          apiURL: "https://blockscout-bellecour.iex.ec/api",
          browserURL: "https://blockscout-bellecour.iex.ec/"
        }
      }
    ]
  },
};

function mainnetNetworkConfig() {
  let url = "https://mainnet.infura.io/v3/";
  let accountPrivateKey =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  if (process.env.MAINNET_ENDPOINT) {
    url = `${process.env.MAINNET_ENDPOINT}`;
  }

  if (process.env.MAINNET_PRIVATE_KEY) {
    accountPrivateKey = `${process.env.MAINNET_PRIVATE_KEY}`;
  }

  return {
    url: url,
    accounts: [accountPrivateKey],
  };
}

function goerliNetworkConfig() {
  let url = "https://goerli.infura.io/v3/";
  let accountPrivateKey =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  if (process.env.GOERLI_ENDPOINT) {
    url = `${process.env.GOERLI_ENDPOINT}`;
  }

  if (process.env.GOERLI_PRIVATE_KEY) {
    accountPrivateKey = `${process.env.GOERLI_PRIVATE_KEY}`;
  }

  return {
    url: url,
    accounts: [accountPrivateKey],
  };
}

function iExecVivaniNetworkConfig() {
  let url = "https://viviani.iex.ec";
  let accountPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
  if (process.env.IEXEC_VIVANI_ENDPOINT) {
    url = `${process.env.IEXEC_VIVANI_ENDPOINT}`;
  }

  if (process.env.IEXEC_VIVANI_PRIVATE_KEY) {
    accountPrivateKey = `${process.env.IEXEC_VIVANI_PRIVATE_KEY}`;
  }

  return {
    url: url,
    gasPrice: 0, 
    accounts: [accountPrivateKey],
  };
}

function iExecBellecourNetworkConfig() {
  let url = "https://bellecour.iex.ec";
  let accountPrivateKey = "0x0000000000000000000000000000000000000000000000000000000000000000";
  if (process.env.IEXEC_BELLECOUR_ENDPOINT) {
    url = `${process.env.IEXEC_BELLECOUR_ENDPOINT}`;
  }

  if (process.env.IEXEC_BELLECOUR_PRIVATE_KEY) {
    accountPrivateKey = `${process.env.IEXEC_BELLECOUR_PRIVATE_KEY}`;
  }

  return {
    url: url,
    gasPrice: 0, 
    accounts: [accountPrivateKey],
  };
}

function getEtherscanApiKey() {
  let apiKey = "";
  if (process.env.ETHERSCAN_API_KEY) {
    apiKey = `${process.env.ETHERSCAN_API_KEY}`;
  }
  return apiKey;
}