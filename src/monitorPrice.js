const web3 = require("./web3");
const { uniswapContract } = require("./exchanges/ropstenUniswap");

const ETH_AMOUNT = web3.utils.toWei("1", "Ether");

let monitoringPrice = false;

async function monitorPrice() {
  if (monitoringPrice) {
    return;
  }

  console.log("Checking price...");
  monitoringPrice = true;

  try {
    // Check Eth Price
    const daiAmount = await uniswapContract.methods
      .getEthToTokenInputPrice(ETH_AMOUNT)
      .call();
    const price = web3.utils.fromWei(daiAmount.toString(), "Ether");
    console.log("Eth Price:", price, " DAI");
  } catch (error) {
    console.error(error);
    monitoringPrice = false;
    clearInterval(priceMonitor);
    return;
  }

  monitoringPrice = false;
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 1000; // 1 Second

const priceMonitor = () => {
  setInterval(async () => {
    await monitorPrice();
  }, POLLING_INTERVAL);
};

module.exports = priceMonitor;
