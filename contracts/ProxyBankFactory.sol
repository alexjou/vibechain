// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./Bank.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ProxyVaultFactory is ReentrancyGuard {
    uint256 public constant MAX_TX = 100;
    address[] public vaults;
    mapping(address => address) public clientToVault;
    uint256 public transactionCount;
    address public currentVault;
    address public owner;

    event NewVault(address vault);
    event NewTransaction(address client, address vault, uint256 transactionCount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        _createNewVault();
    }

    function _createNewVault() internal {
        Bank newVault = new Bank();
        currentVault = address(newVault);
        vaults.push(currentVault);
        transactionCount = 0;
        emit NewVault(currentVault);
    }

    function getVaults() external view returns (address[] memory) {
        return vaults;
    }

    function getCurrentVault() public view returns (address) {
        return currentVault;
    }

    function registerTransaction(address client) external nonReentrant {
        require(currentVault != address(0), "No active vault");
        require(client != address(0), "Invalid client");
        clientToVault[client] = currentVault;
        transactionCount++;
        emit NewTransaction(client, currentVault, transactionCount);
        if (transactionCount >= MAX_TX) {
            _createNewVault();
        }
    }

    // Administrative function for the owner to force creation of a new vault
    function forceNewVault() external onlyOwner nonReentrant {
        _createNewVault();
    }

    // Administrative function to remove a vault from the array (if necessary)
    function removeVault(uint256 index) external onlyOwner nonReentrant {
        require(index < vaults.length, "Invalid index");
        for (uint256 i = index; i < vaults.length - 1; i++) {
            vaults[i] = vaults[i + 1];
        }
        vaults.pop();
    }
}
