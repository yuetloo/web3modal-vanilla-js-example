# web3modal-vanilla-js-example

This is an example of web3modal (vanilla javascript version) using [ethers.js](https://github.com/ethers-io/ethers.js) instead of web3 modified from the https://github.com/Web3Modal/web3modal-vanilla-js-example.

### How to run

Because of web security reasons, the wallet would not load if opening the index.html file using `file://` protocol.

Start a simple web server using the python SimpleHTTPServer. Run the following command from the folder of index.html.

```
python -m SimpleHTTPServer 8000
```

Now, open http://localhost:8000 to see the app.

### Warning

Keep in mind that this is not a `secure` app, do not use this on production. The application has no security checking to simplify the code to show the basic of how to use ethers.js with web3modal.

### Interacting with Contract

The part that create a token using a contract only works if the wallet is connected to the `rinkeby` network because the contract is only available on the `rinkeby` network.

### Known Issues

The `create token` contract will throw if a token had already been created for the same address and ticket number. You will see `invalid BigNumber` error. See [issue 1234](https://github.com/ethers-io/ethers.js/issues/1243) more details.

Sometimes the wallet and the app might go out of sync such that there is no communication between them. Try to disconnect the app from the wallet and reconnect again to see if this fixes the issue.

Sometimes it takes a while (more than 10 seconds) before the transaction shows up on the wallet, just be patient.
