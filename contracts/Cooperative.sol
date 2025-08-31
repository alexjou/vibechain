// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Cooperative {
    string name;
    string cnpj;
    string cpf;
    string email;
    address private _vaultAddress;
    address private _owner;
    uint256 balance;
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
        emit OwnerDeposit(msg.sender, msg.value, message);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
