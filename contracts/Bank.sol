// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IDonation.sol";

contract Bank is IDonation {
    mapping(address => uint256) public credits;
    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint amount);

    constructor() {}

    function deposit() external payable {
        require(msg.value > 0, "Send some Ether");
        credits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function checkBalance(address user) external view returns (uint256) {
        return credits[user];
    }

    function withdraw(uint256 amount) external {
        require(credits[msg.sender] >= amount, "Insufficient balance");
        credits[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed...");
        emit Withdrawal(msg.sender, amount);
    }
}
