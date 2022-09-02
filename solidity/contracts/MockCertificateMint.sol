// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "./CertificateMint.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @title MockCertificateMint
 * @dev This contract is ONLY for test purpose
 *
 * ======DO NOT DEPLOYED THIS IN PRODUCTION=====
 *
 */
contract MockCertificateMint is CertificateMint {
    constructor(address _mockContract)
        CertificateMint(
            _mockContract,
            "https://metadatas.rnft.fake/"
        )
    {}
}

/**
 * @title MockERC721
 * @dev This contract is ONLY for test purpose
 *
 * ======DO NOT DEPLOYED THIS IN PRODUCTION=====
 *
 */
contract MockERC721 is ERC721 {
    constructor(address to) ERC721("Mock Contract ERC721", "MC721"){
        _mint(to, 0);
    }

}

/**
 * @title MockERC1155
 * @dev This contract is ONLY for test purpose
 *
 * ======DO NOT DEPLOYED THIS IN PRODUCTION=====
 *
 */
contract MockERC1155 is ERC1155 {
    constructor(address to) ERC1155("https://metadatas.rnft.fake/") {
        _mint(to, 2, 1, "");
    }
}

/**
 * @title MockIExecOracle
 * @dev This contract is ONLY for test purpose
 *
 * ======DO NOT DEPLOYED THIS IN PRODUCTION=====
 *
 */
contract MockIExecOracle {

    bytes32 public hashKeyERC721;
    bytes32 public hashKeyERC1155;

    constructor(address _addrERC721, uint256 _idERC721, address _addrERC1155, uint _idERC1155) {
        hashKeyERC721 = keccak256(abi.encodePacked(_addrERC721, _idERC721));
        hashKeyERC1155 = keccak256(abi.encodePacked(_addrERC1155, _idERC1155)); 
    }

    function getRaw(bytes32 oracleId) external view returns (bytes memory, uint256) {
        bytes memory val1 = abi.encodePacked(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
        bytes memory val2 = abi.encodePacked(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
        return (oracleId == hashKeyERC721 ? val1 : val2, uint256(1));
    }
}
