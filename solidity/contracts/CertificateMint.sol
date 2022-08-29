// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.9;

import "../node_modules/erc721a/contracts/ERC721A.sol";
import "./Oracle.sol";

import "hardhat/console.sol";


/** 
 * @title CertificateMint 
 * @dev This contract allow creation of reproduction certificate 
 */
contract CertificateMint is ERC721A {
    
    // Oracle interface
    Oracle private _oracle;

    /**
     * @dev Store the address with the token id of the NFT smart contract on the oracle 
     * Oracle GET https://api.opensea.io/api/v1/asset/{asset_contract_address}/{token_id}/
     */
    struct AddressTokenId{
        address addr;
        uint256 tokenId;
    }

    // Map the has of AddressTokenId to OracleID
    mapping(bytes32 => bytes32) private _oracleIds;

    // Map the hash of AddressTokenId to Oracle value
    mapping(bytes32 => int256) private _lastPrices;

    constructor(address _oracleAddress) ERC721A("rNFT Certificate", "RNFT") {
        _oracle = Oracle(_oracleAddress);
    }

    // -----------------------------------------
    // External interface
    // -----------------------------------------

    /**
     * @return _oracle iExec Oracle contract address
     */
    function getOracleContract() external view returns(Oracle){
        return _oracle;
    }

     /**
     * @param _smartContract is the smart contract address of the NFT
     * @param _tokenId is the tokenId of the NFT
     * @return _oracleIds of a specific NFT
     */
    function getOracleId(address _smartContract, uint256 _tokenId) external view returns(bytes32){
        return _oracleIds[keccak256(abi.encodePacked(_smartContract, _tokenId))];
    }

   
    // -----------------------------------------
    // Public interface
    // -----------------------------------------

    /**
     * @dev getOracleValue fetch the last price of an NFT thanks to it's address and tokenId
     * @dev lastPrices get updated if the Oracle existed
     * @param _smartContract is the smart contract address of the NFT
     * @param _tokenId is the tokenId of the NFT
     * @return value result from the computation of the following API call GET https://api.opensea.io/api/v1/asset/{_smartContract}/{_tokenID}/
     */
    function getOracleValue(address _smartContract, uint256 _tokenId )
        public
        returns (int256)
    {
        bytes32 hashKey = keccak256(abi.encodePacked(_smartContract, _tokenId));

        require(
            _oracleIds[hashKey] != 0x0,
            "CertificateMint - Oracle doesn't exist, please create one before call this function." 
        );
        
        (int256 value, uint256 _date) = _oracle.getInt(_oracleIds[hashKey]);
        
        _lastPrices[hashKey] = value;
        
        return value; 
    }

    /**
     * @param _smartContract is the smart contract address of the NFT
     * @param _tokenId is the tokenId of the NFT
     * @return _lastPrices of a specific NFT
     */
    function getLastPrice(address _smartContract, uint256 _tokenId) public view returns(int256){
        return _lastPrices[keccak256(abi.encodePacked(_smartContract, _tokenId))];
    }

    /**
     * @dev Push the new oracle id of a specific NFT thanks to `_smartContract` and `_tokenId` 
     * @param _smartContract is the smart contract address of the NFT
     * @param _tokenId is the tokenId of the NFT
     */
    function newOracleIds(address _smartContract, uint256 _tokenId, bytes32 _oracleId) public{
        bytes32 hashKey = keccak256(abi.encodePacked(_smartContract, _tokenId));

        require(
            _oracleId != 0x0,
             "CertificateMint - Oracle Id must be different of 0." 
        );
        require(
            _oracleIds[hashKey] == 0x0,
            "CertificateMint - Oracle Id already exist"    
        );
        
        _oracleIds[hashKey] = _oracleId;
    }
    
}
