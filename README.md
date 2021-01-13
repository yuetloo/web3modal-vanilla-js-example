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
