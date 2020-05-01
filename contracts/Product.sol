pragma solidity ^0.6.4;




contract Product{

    bytes32 name;
    supplyBlock[] supplyChain;
    bytes32 UUID;

    constructor(bytes32 _name, bytes32 _description) public{
        name = _name;
        supplyBlock firstBlock = new supplyBlock(_description);
        supplyChain.push(firstBlock);
        UUID = bytes32(keccak256(abi.encode(msg.sender, block.timestamp)));
    }

    function addBlock(bytes32 _description) public {
        supplyBlock newBlock = new supplyBlock(_description);
        supplyChain.push(newBlock);

    }

    function getUUID() public view returns (bytes32){
        return UUID;
    }

    function getChain() public view returns(address[] memory, uint[] memory, bytes32[] memory){
        address[] memory suppliers;
        uint[] memory times;
        bytes32[] memory descriptions;

        for (uint i = 0; i <= supplyChain.length; i++){
            suppliers[i] = supplyChain[i].getSupplier();
            times[i] = supplyChain[i].getTime();
            descriptions[i] = supplyChain[i].getDescription();
        }

        return (suppliers,times,descriptions);

    }

}

contract supplyBlock{
    address supplier;
    uint time;
    bytes32 description;

    constructor(bytes32 _description) public{
        supplier = msg.sender;
        time = block.timestamp;
        description = _description;
    }

    function getSupplier() public view returns(address){
        return supplier;
    }

    function getTime() public view returns(uint){
        return time;
    }

    function getDescription() public view returns(bytes32){
        return description;
    }

}