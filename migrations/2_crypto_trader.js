const CryptoTrader = artifacts.require("CryptoTrader");

module.exports = function(deployer) {
  deployer.deploy(CryptoTrader);
};
