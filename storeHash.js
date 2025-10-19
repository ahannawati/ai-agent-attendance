// storeHash.js
// Save attendance summary hash to local Ganache blockchain
// --------------------------------------------------------

const { Web3 } = require("web3");

// --- Connect to Ganache ---
const GANACHE_URL = "http://127.0.0.1:7545";
const web3 = new Web3(GANACHE_URL);

// --- Account setup ---
const PRIVATE_KEY = "0x24a35fc817526068d454aa8c9dbcf13c3c60ea5b5fe0cbfb6d040d21c7a019b2";
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// --- Read params from n8n ---
const summaryHash = (process.argv[2] || "undefined").trim();
const summaryDate = (process.argv[3] || "N/A").trim();
const validCount = (process.argv[4] || "0").trim();
const expiredCount = (process.argv[5] || "0").trim();

// --- Debug: confirm arguments received ---
console.log("Args received:", process.argv.slice(2));

// --- Compose message to embed in blockchain ---
const message = `AH_Attendance:${summaryHash}|${summaryDate}|Valid:${validCount}|Expired:${expiredCount}`;

(async () => {
  try {
    // --- Check account and balance ---
    console.log("Connected account:", account.address);
    const balanceWei = await web3.eth.getBalance(account.address);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    console.log("Balance (ETH):", balanceEth);

    // --- Encode message as transaction data ---
    const txData = web3.utils.utf8ToHex(message);
    console.log("Message being stored:", message);

    // --- Create transaction ---
    const gasPrice = await web3.eth.getGasPrice();
    const tx = {
      from: account.address,
      to: account.address, // self-transaction (store message only)
      value: 0,
      gas: 500000,
      gasPrice: gasPrice,
      data: txData,
    };

    // --- Send transaction ---
    const receipt = await web3.eth.sendTransaction(tx);

    // --- Return clean JSON for n8n ---
    const output = {
      status: "success",
      summaryHash,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber?.toString(),
      gasUsed: receipt.gasUsed?.toString(),
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(output, null, 2));
  } catch (err) {
    const errorOut = {
      status: "error",
      error: err.message,
    };
    console.error(JSON.stringify(errorOut, null, 2));
  }
})();
