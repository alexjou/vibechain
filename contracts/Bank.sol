// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IDonation.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is IDonation, Ownable {
    mapping(address => uint256) public credits;
    bool private paused;
    
    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint amount);
    event Paused(address indexed by);
    event Unpaused(address indexed by);

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }

    constructor() Ownable(msg.sender) {
        paused = false;
    }

    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Send some Ether");
        credits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function checkBalance(address user) external view returns (uint256) {
        return credits[user];
    }

    function withdraw(uint256 amount) external whenNotPaused {
        require(credits[msg.sender] >= amount, "Insufficient balance");
        credits[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed...");
        emit Withdrawal(msg.sender, amount);
    }

    // Função para pausar o contrato (apenas o owner)
    function pause() external onlyOwner whenNotPaused {
        paused = true;
        emit Paused(msg.sender);
    }

    // Função para despausar o contrato (apenas o owner)
    function unpause() external onlyOwner whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // Função para verificar se o contrato está pausado
    function isPaused() external view returns (bool) {
        return paused;
    }
}
