const express = require("express");

require("dotenv").config();

// SERVER CONFIG
const port = process.env.PORT || 5000;
const app = express();

app.listen(port, () => {
  console.log(`Listening on port ${port} :)`);
});
