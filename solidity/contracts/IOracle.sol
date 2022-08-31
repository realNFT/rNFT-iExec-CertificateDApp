// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

interface IOracle {
    
    function getRaw(bytes32)
        external
        returns (bytes memory, uint256);

    function getString(bytes32)
        external
        returns (string memory, uint256);

    function getInt(bytes32) 
        external 
        returns (int256, uint256);

    function getBool(bytes32) 
        external
        returns (bool, uint256);

}