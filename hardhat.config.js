require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv");
require("path");

const DEFAULT_GAS_MULTIPLIER = 1;

// dotenvConfig({ path: resolve(__dirname, "./.env") });

const {  LINEASCAN_API_KEY } = process.env;

//const PRIVATE_KEY = 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },



 // defaultNetwork: "hardhat",
//  etherscan: {
//   apiKey: {
//     linea_goerli: LINEASCAN_API_KEY
//   },
//   customChains: [
//     {
//       network: "linea_goerli",
//       chainId: 59140,
//       urls: {
//         apiURL: "https://api.lineascan.build/api",
//         browserURL: "https://lineascan.build/"
//       }
//    }
  // ]
// },


//   gasReporter: {
    // enabled: true, //process.env.REPORT_GAS ? true : false,
    // gasPriceApi: process.env.GASPRICE_API_ENDPOINT,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    // showTimeSpent: true,
    // showMethodSig: true,
    // token: "ETH",
    // currency: "USD",
    // excludeContracts: [],
    // src: "./contracts",
  //},
  networks: {
    // hardhat: {
    //   accounts: {
    //     //mnemonic,
    //   },
    //   //chainId: chainIds.hardhat,
    // },
    truffle: {
      url: "http://localhost:24012/rpc",
      timeout: 60000,
      gasMultiplier: DEFAULT_GAS_MULTIPLIER,
    },
    lumx: {
        url: "https://fraa-dancebox-3082-rpc.a.dancebox.tanssi.network/",
        accounts:[`0x${PRIVATE_KEY}`],
        chainId: 25022022
      },
    // linea_goerli: {
    //   url: "https://linea-goerli.infura.io/v3/5b950e5c8602425b8b34aa7f19514c9a",
    //   // timeout: 60000,
    //   // gasMultiplier: DEFAULT_GAS_MULTIPLIER,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 59140
    // },
    // arbitrum: getChainConfig("arbitrum-mainnet"),
    // avalanche: getChainConfig("avalanche"),
    // bsc: getChainConfig("bsc"),
    // mainnet: getChainConfig("mainnet"),
    // // optimism: getChainConfig("optimism-mainnet"),
    // "polygon-mainnet": getChainConfig("polygon-mainnet"),
    // "polygon-mumbai": getChainConfig("polygon-mumbai"),
    // goerli: getChainConfig("goerli"),
    // sepolia: getChainConfig("sepolia"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  mocha: {
    timeout: 40000
  }
  
};
