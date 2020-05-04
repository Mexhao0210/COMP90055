pragma solidity ^0.6.4;

contract Product{

    bytes32 name;
    bytes32 description;
    supplyBlock[] supplyChain;
    bytes32 UUID;

    constructor(bytes32 _name, bytes32 _description) public{
        require(
            _name != "",
            "Please enter a valid name."
        );

        require(
            _description != "",
            "Please enter a valid description."
        );

        name = _name;
        description = _description;
        UUID = bytes32(keccak256(abi.encode(msg.sender, block.timestamp)));
    }

    event renewChain(
        bytes32[] suppliers,
        bytes32[] times,
        bytes32[] descriptions
    );

    function addBlock(bytes32 _name, bytes32 _time,bytes32 _description) public {
        supplyBlock newBlock = new supplyBlock(_name, _time, _description);
        supplyChain.push(newBlock);

        bytes32[] memory suppliers;
        bytes32[] memory times;
        bytes32[] memory descriptions;

        for (uint i = 0; i <= supplyChain.length; i++){
            suppliers[i] = supplyChain[i].getSupplierName();
            times[i] = supplyChain[i].getTime();
            descriptions[i] = supplyChain[i].getDescription();
        }

        emit renewChain(suppliers, times, descriptions);
    }

    function getUUID() public view returns (bytes32){
        return UUID;
    }

    // function getChain() public view returns(bytes32[] memory, bytes32[] memory, bytes32[] memory){
    //     bytes32[] memory suppliers;
    //     bytes32[] memory times;
    //     bytes32[] memory descriptions;

    //     for (uint i = 0; i <= supplyChain.length; i++){
    //         suppliers[i] = supplyChain[i].getSupplierName();
    //         times[i] = supplyChain[i].getTime();
    //         descriptions[i] = supplyChain[i].getDescription();
    //     }

    //     return (suppliers,times,descriptions);

    // }
}

contract supplyBlock{
    address supplier_address;
    bytes32 supplier_name;//商家登录后，从数据库中直接读取
    bytes32 time;//solidity没法获取当前时间，需要js提供。
    bytes32 description;

    constructor(bytes32 _supplier_name, bytes32 _time, bytes32 _description) public{
        require(
            _supplier_name != "",
            "Please enter a valid supplier name."
        );

        require(
            _time != "",
            "Please enter a valid time."
        );

        require(
            _description != "",
            "Please enter a valid description."
        );

        supplier_address = msg.sender;
        supplier_name = _supplier_name;
        time = _time;
        description = _description;
    }

    function getSupplierAdd() public view returns(address){
        return supplier_address;
    }

    function getSupplierName() public view returns(bytes32){
        return supplier_name;
    }

    function getTime() public view returns(bytes32){
        return time;
    }

    function getDescription() public view returns(bytes32){
        return description;
    }

}