const express = require("express");
const monitorPrice = require("./src/monitorPrice");

require("dotenv").config();

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 1000; // 1 Second
priceMonitor = setInterval(async () => {
  await monitorPrice();
}, POLLING_INTERVAL);

// SERVER CONFIG
const port = process.env.PORT || 5000;
const app = express();

app.listen(port, () => {
  console.log(`Listening on port ${port} :)`);
});
