// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDonation {
    function deposit() external payable;
    function checkBalance(address user) external view returns (uint256);
    function withdraw(uint256 amount) external;
}
