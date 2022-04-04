const ethers = require("ethers");

require("dotenv").config();

// THESE ARE BSC TESTNET ADDRESSES!
const WBNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
const BUSD = "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7";

const router = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

/*  BSC Mainnet 
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    BSC Testnet
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545'); */

const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const signer = wallet.connect(provider);

const routerContract = new ethers.Contract(
  router,
  [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  ],
  signer
);

const busdContract = new ethers.Contract(
  BUSD,
  ["function approve(address spender, uint256 amount) external returns (bool)"],
  signer
);

const swap = async () => {
  const BUSDamountIn = ethers.utils.parseUnits("10", 18);
  let amounts = await routerContract.getAmountsOut(BUSDamountIn, [BUSD, WBNB]);
  const WBNBamountOutMin = amounts[1].sub(amounts[1].div(10));

  console.log("Input:", ethers.utils.formatEther(BUSDamountIn));
  console.log(
    "Minimum output accepted:",
    ethers.utils.formatEther(WBNBamountOutMin)
  );

  // Approve amount
  console.log(`Waiting for approval transaction...`);
  const approveTx = await busdContract.approve(router, BUSDamountIn);
  let receipt = await approveTx.wait();
  console.log(`Approved ${BUSDamountIn / 10 ** 18} BUSD.`);

  // Swap amount
  console.log(`Attempting swap...`);
  const swapTx = await routerContract.swapExactTokensForTokens(
    BUSDamountIn,
    WBNBamountOutMin,
    [BUSD, WBNB],
    wallet.address,
    Date.now() + 1000 * 60 * 10,
    { gasLimit: 250000 }
  );

  receipt = await swapTx.wait();
  console.log(
    `Swapped ${BUSDamountIn / 10 ** 18} BUSD for ${Number(
      WBNBamountOutMin / 10 ** 18
    ).toFixed(6)} BNB on wallet ${wallet.address}.`
  );
};

module.exports = { swap };
