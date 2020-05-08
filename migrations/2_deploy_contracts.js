var Product = artifacts.require("Product");
var supplyBlock = artifacts.require("supplyBlock");

module.exports = function(deployer) {
  deployer.deploy(Product);
};

module.exports = function(deployer) {
  deployer.deploy(supplyBlock);
};