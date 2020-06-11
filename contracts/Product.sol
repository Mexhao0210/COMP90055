pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract Main{
    
    //'exist' is used to verify whether the key-value pair exists, true when it exists, false when it does not exist
    //'isNull' is used to verify whether the chain is empty, true when it was first created, and false after being added
    //String[] is used to store the md5 of each supply chain information
    struct Product{
        bool exist;
        bool isNull;
        string[] chain;
    }

    mapping(string => Product) public productChain; //Mapping UUID to commodity structure

    //Called when creating a new product, mapped to a product structure containing an empty array
    function createProduct(string memory _UUID) public returns (string memory){
        require(
            keccak256(abi.encodePacked(_UUID)) != keccak256(abi.encodePacked("")),
            "Please enter a UUID."
        );

        string[] memory new_chain;
        productChain[_UUID] = Product(true, true, new_chain);

        return "Product create successfully!";
    }

    //Transmit UUID and md5 value of the latest Block to update industry chain information
    function updateChain(string memory _UUID, string memory description) public returns (string memory){
        //Check if UUID is empty
        require(
            keccak256(abi.encodePacked(_UUID)) != keccak256(abi.encodePacked("")),
            "Please enter a UUID."
        );

        //Check if description is empty
        require(
            keccak256(abi.encodePacked(description)) != keccak256(abi.encodePacked("")),
            "Please enter a valid description."
        );

        //Check if there is the key in the mapping
        require(
            productChain[_UUID].exist,
            "Please enter a valid UUID."
        );

        //If the product is just created, the array is still empty
        if(productChain[_UUID].isNull){
            productChain[_UUID].isNull = false;
            string[] memory new_chain = new string[](1);
            new_chain[0] = description;
            productChain[_UUID].chain = new_chain;
        }else{
            string[] memory pre_chain = getChain(_UUID);
            string[] memory new_chain = new string[](pre_chain.length+1);

            for (uint i = 0; i <= pre_chain.length; i++){
                if(i <= pre_chain.length-1){
                    new_chain[i] = pre_chain[i];
                } else{
                    new_chain[i] = description;
                }
            }

            productChain[_UUID].chain = new_chain;
        }

        return "Product chain update successfully!";
    }

    //Get the overall chain information of a UUID corresponding product
    function getChain(string memory _UUID) public view returns (string[] memory){
        //Check if UUID is empty
        require(
            keccak256(abi.encodePacked(_UUID)) != keccak256(abi.encodePacked("")),
            "Please enter a UUID."
        );

        //Check if there is the key in the mapping
        require(
            productChain[_UUID].exist,
            "Please enter a valid UUID."
        );

        //Check if the commodity industry chain is empty
        require(
            !productChain[_UUID].isNull,
            "This product does not have any industry chain information."
        );

        string[] memory full_chain = productChain[_UUID].chain;
        return full_chain;
    }

    //Pass the UUID to get the md5 of the last block for checking
    function getLastBlock(string memory _UUID) public view returns (string memory){
        //Check if UUID is empty
        require(
            keccak256(abi.encodePacked(_UUID)) != keccak256(abi.encodePacked("")),
            "Please enter a UUID."
        );

        //Check if there is the key in the mapping
        require(
            productChain[_UUID].exist,
            "Please enter a valid UUID."
        );

        //Check if the commodity industry chain is empty
        require(
            !productChain[_UUID].isNull,
            "This product does not have any industry chain information."
        );

        string[] memory full_chain = productChain[_UUID].chain;
        string memory lastBlock = full_chain[full_chain.length-1];
        return lastBlock;
    }
}

