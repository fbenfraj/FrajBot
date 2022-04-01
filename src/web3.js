const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

require("dotenv").config();

const provider = new Web3(
  new HDWalletProvider(process.env.PRIVATE_KEY, process.env.RPC_URL)
);

const web3 = new Web3(provider);

module.exports = web3;
