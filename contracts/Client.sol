// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IDonation.sol";

contract Client {
    address private vaultAddress;
    address private owner;
    event OwnerDeposit(address indexed ownerAddr, uint256 amount);

    constructor(address _vault) {
        require(_vault != address(0), "Vault address cannot be zero");
        vaultAddress = _vault;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner of this client contract can call this function"
        );
        _;
    }

    receive() external payable {}

    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Need to send some Ether");
        IDonation(vaultAddress).deposit{value: msg.value}();
        emit OwnerDeposit(msg.sender, msg.value);
    }

    // Withdrawal function removed: only the Vault owner can withdraw directly from the vault.
}
