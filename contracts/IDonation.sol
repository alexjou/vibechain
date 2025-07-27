// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// struct Donation {
//     uint256 amount;
//     string message;
// }

interface IDonation {
    function depositExternal(string calldata message) external payable;
    function checkBalance(address user) external view returns (uint256);
    function withdraw(uint256 amount) external;
    // function getDonations(address user) external view returns (Donation[] memory);
}
