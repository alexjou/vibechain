// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IDonation.sol";

contract Client {
    address private _vaultAddress;
    address private _owner;
    event OwnerDeposit(address indexed owner, uint256 amount, string message);

    constructor(address vault) {
        require(vault != address(0), "Vault address cannot be zero");
        _vaultAddress = vault;
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == _owner,
            "Only the owner of this client contract can call this function"
        );
        _;
    }

    receive() external payable {}

    function deposit(string calldata message) external payable onlyOwner {
        require(msg.value > 0, "Must send some Ether");
        IDonation(_vaultAddress).depositExternal{value: msg.value}(message);
        emit OwnerDeposit(msg.sender, msg.value, message);
    }
}
