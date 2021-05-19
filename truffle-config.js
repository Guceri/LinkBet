require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = `crunch ecology what exhibit motor tray obvious absorb parade loud frozen mixture`

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }, 
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/635f1ee59b9b46a88f622162a7bb275d`),
      network_id: 4,       
      gas: 9500000,        
      confirmations: 0,    
      timeoutBlocks: 200,  
      skipDryRun: true     
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {


    solc: {
      version: "0.6.6",
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: 'istanbul'
    }



  }
}
