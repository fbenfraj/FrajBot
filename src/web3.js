import Web3 from "web3";

const HDWalletProvider = require("@truffle/hdwallet-provider");

const provider = new Web3(
  new HDWalletProvider(process.env.PRIVATE_KEY, process.env.INFURA_API_KEY)
);

const web3 = new Web3(provider);

export default web3;
