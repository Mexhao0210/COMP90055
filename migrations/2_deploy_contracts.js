var Product = artifacts.require("Product");
var supplyBlock = artifacts.require("supplyBlock");
var Main = artifacts.require("Main");

module.exports = function(deployer) {
  deployer.deploy(Main);
  deployer.deploy(Product);
  deployer.deploy(supplyBlock);
};