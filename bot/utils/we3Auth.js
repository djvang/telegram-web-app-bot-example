const { Web3Auth } = require("@web3auth/node-sdk");

const web3auth = new Web3Auth({
  clientId:
    "BNqZbXcv8MUGg3r3P4lI-Kbj31c4dfP1lXJp3qJcQrbDrvTlt_njOz8Ut7vsPLOccZLBt9SDExLCWRbl2FRDygQ", // Get your Client ID from Web3Auth Dashboard
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
  },
});

web3auth.init({ network: "testnet" });

const connect = async ({ verifier, verifierId, idToken }) => {
  const provider = await web3auth.connect({
    verifier, // replace with your verifier name
    verifierId, // replace with your verifier id, setup while creating the verifier on Web3Auth's Dashboard
    idToken, // replace with your newly created unused JWT Token.
  });
  const eth_private_key = await provider.request({ method: "eth_private_key" });
  console.log("ETH Private Key", eth_private_key);
};

module.exports = {
  connect,
};
