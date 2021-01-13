"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const ethers = window.ethers;

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

// token contract address
const contractAddress = "0x1319b0457c4e39a259F8e18d1e2Dc316A941aE20";
// contract abi
const contractAbi = [
  "function createToken(address tokenOwner, bytes32 ticket) public",
];

/**
 * Setup the orchestra
 */
function init() {
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log(
    "window.ethers is",
    ethers,
    "window.ethereum is",
    window.ethereum
  );

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      },
    },
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  console.log("Web3Modal instance is", web3Modal);
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {
  const wallet = new ethers.providers.Web3Provider(provider);
  const network = await wallet.getNetwork();
  document.querySelector("#network-name").textContent = network.name;

  // token contract only exists on rinkeby
  document.querySelector("#create-token").style.display =
    network.name === "rinkeby" ? "block" : "none";

  // Get account of the connected wallet
  const signer = wallet.getSigner();
  selectedAccount = await signer.getAddress();
  document.querySelector("#selected-account").textContent = selectedAccount;

  // Get account balance
  const balance = await signer.getBalance();
  document.querySelector(
    "#account-balance"
  ).textContent = ethers.utils.formatEther(balance);

  document.getElementById("txhash").textContent = "";

  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {
  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
  await fetchAccountData();
  document.querySelector("#btn-connect").removeAttribute("disabled");
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {
  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {
  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if (provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

async function onCreateToken() {
  let ticketByte32String;

  try {
    const wallet = new ethers.providers.Web3Provider(provider);
    const signer = wallet.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const recipientAddress = document.getElementById("token-recipient").value;
    const ticketValue = document.getElementById("ticket").value;

    try {
      ticketByte32String = ethers.utils.formatBytes32String(ticketValue);
    } catch (err) {
      console.log("format ticket value error", err);
      alert("format ticket value error: " + err.message);
      return;
    }

    const tx = await contract.createToken(recipientAddress, ticketByte32String);

    document.getElementById("txhash").textContent = tx.hash;
  } catch (err) {
    console.log("create token error for ticket ", ticketByte32String, err);
    alert("Create token error. See wallet for more details. " + err.message);
  }
}

/**
 * Main entry point.
 */
window.addEventListener("load", async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document
    .querySelector("#btn-disconnect")
    .addEventListener("click", onDisconnect);

  document
    .querySelector("#btn-create-token")
    .addEventListener("click", onCreateToken);
});
