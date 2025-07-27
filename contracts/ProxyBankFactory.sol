// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./Bank.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProxyVaultFactory is ReentrancyGuard, Ownable {
    uint256 private _maxTx;
    address[] private _vaults;
    mapping(address => address) private _clientToVault;
    uint256 private _transactionCount;
    address private _currentVault;

    event NewVault(address vault);
    event NewTransaction(
        address client,
        address vault,
        uint256 transactionCount
    );

    constructor(uint256 maxTx) Ownable(msg.sender) {
        require(maxTx > 0, "Max transactions must be greater than zero");
        _maxTx = maxTx;
        _createNewVault();
    }

    function _createNewVault() internal {
        Bank newVault = new Bank();
        _currentVault = address(newVault);
        _vaults.push(_currentVault);
        _transactionCount = 0;
        emit NewVault(_currentVault);
    }

    function getVaults() external view returns (address[] memory) {
        return _vaults;
    }

    function getCurrentVault() public view returns (address) {
        return _currentVault;
    }

    function getMaxTx() external view returns (uint256) {
        return _maxTx;
    }

    function registerTransaction(address client) external nonReentrant {
        require(_currentVault != address(0), "No active vault");
        require(client != address(0), "Invalid client");
        _clientToVault[client] = _currentVault;
        _transactionCount++;
        emit NewTransaction(client, _currentVault, _transactionCount);
        if (_transactionCount >= _maxTx) {
            _createNewVault();
        }
    }

    // Administrative function for the owner to force creation of a new vault
    function forceNewVault() external onlyOwner nonReentrant {
        _createNewVault();
    }

    // Administrative function to remove a vault from the array (if necessary)
    function removeVault(uint256 index) external onlyOwner nonReentrant {
        require(index < _vaults.length, "Invalid index");
        for (uint256 i = index; i < _vaults.length - 1; i++) {
            _vaults[i] = _vaults[i + 1];
        }
        _vaults.pop();
    }
}
