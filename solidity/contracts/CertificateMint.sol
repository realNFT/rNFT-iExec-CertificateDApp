// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "../node_modules/erc721a/contracts/ERC721A.sol";
import "./IOracle.sol";

import "hardhat/console.sol";

/**
 * @title CertificateMint
 * @dev This contract allow creation of reproduction certificate
 */
contract CertificateMint is ERC721A, Ownable {
    using ERC165Checker for address;

    // Oracle interface
    IOracle private _oracle;

    // rFNT base URI for certificate
    string private _rNFTbaseURI;

    /**
     * @dev Store the address with the token id of the NFT smart contract on the oracle
     * Oracle GET https://api.opensea.io/api/v1/asset/{asset_contract_address}/{token_id}/
     */
    struct AddressTokenId {
        address addr;
        uint256 tokenId;
    }

    // Map the has of AddressTokenId to OracleID
    mapping(bytes32 => bytes32) private _oracleIds;

    modifier onlyEthereumOwner(address _smartContract, uint256 _tokenId){
        //console.log(msg.sender == getOracleValue(_smartContract, _tokenId));
        //console.log(msg.sender, getOracleValue(_smartContract, _tokenId));
        
        require(
           msg.sender == getOracleValue(_smartContract, _tokenId),
            "CertificateMint - You are not the owner of this NFT according to OpenSea API"
        );
        _;
    }

    constructor(address _oracleAddress, string memory _initBaseURI) ERC721A("rNFT Certificate", "RNFT") {
        _rNFTbaseURI = _initBaseURI;
        _oracle = IOracle(_oracleAddress);
    }

    // -----------------------------------------
    // External interface
    // -----------------------------------------

    /**
     * @return _oracle iExec Oracle contract address
     */
    function getOracleContract() external view returns (address) {
        return address(_oracle);
    }

    /**
     * @param _smartContract is the smart contract address of the NFT
     * @param _tokenId is the tokenId of the NFT
     * @return _oracleIds of a specific NFT
     */
    function getOracleId(address _smartContract, uint256 _tokenId)
        external
        view
        returns (bytes32)
    {
        return
            _oracleIds[keccak256(abi.encodePacked(_smartContract, _tokenId))];
    }

    /**
     * @dev Change the baseURI of rNFT certificates
     * @param _newBaseURI is the new URI
     */
    function changeBaseURI(string memory _newBaseURI) onlyOwner external {
        _rNFTbaseURI = _newBaseURI;
    }

    // -----------------------------------------
    // Public interface
    // -----------------------------------------

    /**
     * @dev getOracleValue fetch the owner of an NFT in different chain thanks to it's address and tokenId
     * @dev lastPrices get updated if the Oracle existed
     * @param _smartContract is the smart contract address of the NFT
     * @param _tokenId is the tokenId of the NFT
     * @return value result from the computation of the following API call GET https://api.opensea.io/api/v1/asset/{_smartContract}/{_tokenID}/ to GET the owner on Ethereum main chain
     */
    function getOracleValue(address _smartContract, uint256 _tokenId)
        public
        returns (address)
    {
        address addr;
        bytes32 hashKey = keccak256(abi.encodePacked(_smartContract, _tokenId));
        
        require(
            _smartContract != address(0x0),
            "CertificateMint - Smart contract address need to be different to the zero address"
        );

        require(
            _oracleIds[hashKey] != 0x0,
            "CertificateMint - Oracle doesn't exist, please create one before call this function"
        );

        (bytes memory value, ) = _oracle.getRaw(_oracleIds[hashKey]);

        assembly {
            addr := mload(add(value,20))
        }

        return addr;
    }

    /**
     * @dev Push the new oracle id of a specific NFT thanks to `_smartContract` and `_tokenId`
     * @param _smartContract is the smart contract address of the NFT
     * @param _tokenId is the tokenId of the NFT
     */
    function newOracleIds(
        address _smartContract,
        uint256 _tokenId,
        bytes32 _oracleId
    ) public onlyOwner {
        bytes32 hashKey = keccak256(abi.encodePacked(_smartContract, _tokenId));

        require(
            _oracleId != 0x0,
            "CertificateMint - Oracle Id must be different of 0"
        );
        require(
            _oracleIds[hashKey] == 0x0,
            "CertificateMint - Oracle Id already exist"
        );

        _oracleIds[hashKey] = _oracleId;
    }

    /**
     * @dev Mint function reserved to NFT Owner who want to generate an ERC721A reproduction certificate
     * @param smartContract is the smart contract address of a specific NFT used to mint reproduction certificate
     * @param tokenId is the tokenId represent of a specific NFT used to mint reproduction certificate
     **/
    function mint(address smartContract, uint256 tokenId)
        public
        onlyEthereumOwner(smartContract, tokenId)
    {
        _mint(msg.sender, 1);
    }

    // -----------------------------------------
    // Internal interface
    // -----------------------------------------

    /**
     * @dev See docuementation (_baseURI)[https://chiru-labs.github.io/ERC721A/#/erc721a?id=_baseuri]
     */
    function _baseURI() 
        internal 
        view 
        virtual 
        override 
        returns (string memory) 
    {
        return _rNFTbaseURI;
    }
}
