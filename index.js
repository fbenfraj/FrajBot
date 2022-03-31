const express = require("express");
const Web3 = require("web3");

require("dotenv").config();

// WEB3 CONFIG
const provider = new Web3.providers.HttpProvider(process.env.RPC_URL);

web3 = new Web3(provider);

// SERVER CONFIG
const port = process.env.PORT || 5000;
const app = express();

app.listen(port, () => {
  console.log(`Listening on port ${port} :)`);
});
