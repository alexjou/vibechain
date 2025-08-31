// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Cooperative {
    string private _name;
    string private _cnpj;
    string private _cpf;
    string private _email;

    address private _vaultAddress;
    address private _owner;

    event OwnerDeposit(address indexed owner, uint256 amount, string message);
    event CooperativeWithdrawal(address indexed to, uint256 amount);

    constructor(
        address vault,
        string memory name_,
        string memory cnpj_,
        string memory cpf_,
        string memory email_
    ) {
        require(vault != address(0), "Vault address cannot be zero");
        _vaultAddress = vault;
        _owner = msg.sender;

        _name = name_;
        _cnpj = cnpj_;
        _cpf = cpf_;
        _email = email_;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    receive() external payable {}

    function deposit(string calldata message) external payable onlyOwner {
        require(msg.value > 0, "Must send some Ether");
        emit OwnerDeposit(msg.sender, msg.value, message);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");

        (bool success, ) = payable(_vaultAddress).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit CooperativeWithdrawal(_vaultAddress, amount);
    }

    // Metadata getters
    function getName() external view returns (string memory) {
        return _name;
    }

    function getCNPJ() external view returns (string memory) {
        return _cnpj;
    }

    function getCPF() external view returns (string memory) {
        return _cpf;
    }

    function getEmail() external view returns (string memory) {
        return _email;
    }

    function getVaultAddress() external view returns (address) {
        return _vaultAddress;
    }

    function getOwner() external view returns (address) {
        return _owner;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
