// Uniswap SDK only allows you to read data from Uniswap
const {
  ChainId,
  WETH,
  Token,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
  Percent,
} = require("@uniswap/sdk");
const ethers = require("ethers");

require("dotenv").config();

const chainId = ChainId.MAINNET;
// DAI address
const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const swap = async () => {
  const dai = new Token(
    ChainId.MAINNET,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    18
  );
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(dai, weth);

  const route = new Route([pair], weth);

  /* Note: We are not making any trade here we are asking Uniswap if we did 
  the trade what would be the execution price and the next mid price */
  const trade = new Trade(
    route,
    new TokenAmount(weth, "1000000000000000000"),
    TradeType.EXACT_INPUT
  );

  /* The mid-price is the price between the best price of the sellers
  of the stock or commodity offer price or ask price and the best price of
  the buyers of the stock or commodity bid price. It can simply be defined
  as the average of the current bid and ask prices being quoted. */
  //   console.log("Mid price:", route.midPrice.toSignificant(6));
  //   console.log(
  //     "Mid price (inverted):",
  //     route.midPrice.invert().toSignificant(6)
  //   );

  //Execution Price means the price at which the Trade is actually made or executed.
  //   console.log("Execution price:", trade.executionPrice.toSignificant(6));
  //   console.log("Next mid price:", trade.nextMidPrice.toSignificant(6));

  // Now let's send the trade
  const slippageTolerance = new Percent("5", "100");
  // Minimum amount of DAI we accept to receive
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  const path = [weth.address, dai.address];
  // address of my learning purpose wallet
  const to = "0xe986B9bD3ebde28AF08e9de4f2621754faDb2175";
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const value = trade.inputAmount.raw;

  const provider = ethers.getDefaultProvider("mainnet", {
    infura: "https://mainnet.infura.io/v3/4b5b32a4e0d14a3ba8a80ee206a0c812",
  });

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
  const account = signer.connect(provider);
  // Router02 address from Uniswap docs
  // Second argument is the human readable ABI from Ethers
  const uniswap = new ethers.Contract(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    [
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    ],
    account
  );

  const transaction = await uniswap.swapExactETHForTokens(
    ethers.utils.parseUnits(amountOutMin.toString(), 18),
    path,
    to,
    deadline,
    {
      value: ethers.utils.parseUnits(value.toString(), 18),
      gasPrice: 20e9,
    }
  );

  console.log(`Transaction hash: ${transaction.hash}`);
  const receipt = await transaction.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
};

swap();
