import web3 from "./src/web3";

require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 5000;
const app = express();

app.listen(port, () => {
  console.log(`Listening on port ${port}! :)`);
});
