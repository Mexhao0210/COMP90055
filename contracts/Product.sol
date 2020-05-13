pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract Main{

    mapping(bytes => bytes[]) public productChain; //将UUID映射到md5数组

    //传UUID和最新Block的md5值，更新产业链信息
    function updateChain(bytes memory _UUID, bytes memory description) public{
        bytes[] memory pre_chain = getChain(_UUID);
        bytes[] memory new_chain;

        for (uint i = 0; i <= pre_chain.length; i++){
            if(i <= pre_chain.length-1){
                new_chain[i] = pre_chain[i];
            } else{
                new_chain[i] = description;

            }
        }

        productChain[_UUID] = new_chain;
    }

    //得到某个UUID对应商品的整体链信息
    function getChain(bytes memory UUID) public view returns (bytes[] memory){
        bytes[] memory chain = productChain[UUID];
        return chain;
    }

    //传UUID得最后一个块的md5校验
    function getLastBlock(bytes memory UUID) public view returns (bytes memory){
        bytes[] memory chain = productChain[UUID];
        bytes memory lastBlock = chain[chain.length-1];
        return lastBlock;
    }
}

// contract Product{

//     bytes32 description;
//     bytes32 UUID; //由js生成直接传进来
//     supplyBlock[] supplyChain;

//     constructor(bytes32 _description, bytes32 _UUID) public{
//         require(
//             _description != "",
//             "Please enter a valid description."
//         );

//         require(
//             _UUID != "",
//             "Please enter a valid UUID."
//         );

//         description = _description;
//         UUID = _UUID;
//         // UUID = bytes32(keccak256(abi.encode(msg.sender, block.timestamp)));
//     }

//     // event renewChain(
//     //     bytes32[] suppliers,
//     //     bytes32[] times,
//     //     bytes32[] descriptions
//     // );

//     function addBlock(bytes32 _name, bytes32 _time, bytes32 _description) public {
//         supplyBlock newBlock = new supplyBlock(_name, _time, _description);
//         supplyChain.push(newBlock);

//         bytes32[] memory suppliers;
//         bytes32[] memory times;
//         bytes32[] memory descriptions;

//         for (uint i = 0; i <= supplyChain.length; i++){
//             suppliers[i] = supplyChain[i].getSupplierName();
//             times[i] = supplyChain[i].getTime();
//             descriptions[i] = supplyChain[i].getDescription();
//         }

//         Main main = new Main();
//         main.updateChain(UUID, suppliers, times, descriptions);

//         // emit renewChain(suppliers, times, descriptions);
//     }

//     function getUUID() public view returns (bytes32){
//         return UUID;
//     }

//     // function getChain() public view returns(bytes32[] memory, bytes32[] memory, bytes32[] memory){
//     //     bytes32[] memory suppliers;
//     //     bytes32[] memory times;
//     //     bytes32[] memory descriptions;

//     //     for (uint i = 0; i <= supplyChain.length; i++){
//     //         suppliers[i] = supplyChain[i].getSupplierName();
//     //         times[i] = supplyChain[i].getTime();
//     //         descriptions[i] = supplyChain[i].getDescription();
//     //     }

//     //     return (suppliers,times,descriptions);

//     // }
// }


// // 每次ADD Block前先实例化一个supplyBlock再调用add方法
// contract supplyBlock{
//     address supplier_address;
//     bytes32 supplier_name;//商家登录后，从数据库中直接读取
//     bytes32 time;//solidity没法获取当前时间，需要js提供。
//     bytes32 description;

//     constructor(bytes32 _supplier_name, bytes32 _time, bytes32 _description) public{
//         require(
//             _supplier_name != "",
//             "Please enter a valid supplier name."
//         );

//         require(
//             _time != "",
//             "Please enter a valid time."
//         );

//         require(
//             _description != "",
//             "Please enter a valid description."
//         );

//         supplier_address = msg.sender;
//         supplier_name = _supplier_name;
//         time = _time;
//         description = _description;
//     }

//     function getSupplierAdd() public view returns(address){
//         return supplier_address;
//     }

//     function getSupplierName() public view returns(bytes32){
//         return supplier_name;
//     }

//     function getTime() public view returns(bytes32){
//         return time;
//     }

//     function getDescription() public view returns(bytes32){
//         return description;
//     }

// }