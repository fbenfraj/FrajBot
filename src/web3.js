const Web3 = require("web3");

web3 =  new Web3(process.env.RPC_URL)

module.exports = web3;
