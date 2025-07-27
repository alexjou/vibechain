// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./IDonation.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is IDonation, Ownable {
    struct Donation {
        uint256 amount;
        string message;
    }
    mapping(address => Donation[]) private _donations;
    bool private _paused;

    event Deposit(address indexed from, uint256 amount, string message);
    event Withdrawal(address indexed to, uint256 amount);
    event Paused(address indexed by);
    event Unpaused(address indexed by);

    modifier whenNotPaused() {
        require(!_paused, "Contract is paused");
        _;
    }

    modifier whenPaused() {
        require(_paused, "Contract is not paused");
        _;
    }

    constructor() Ownable(msg.sender) {
        _paused = false;
    }

    function depositExternal(
        string calldata message
    ) external payable override whenNotPaused {
        require(msg.value > 0, "Send some Ether");
        _donations[msg.sender].push(
            Donation({amount: msg.value, message: message})
        );
        emit Deposit(msg.sender, msg.value, message);
    }

    function checkBalance(
        address user
    ) external view override returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _donations[user].length; i++) {
            total += _donations[user][i].amount;
        }
        return total;
    }

    function getDonations(
        address user
    ) external view returns (Donation[] memory) {
        return _donations[user];
    }

    function withdraw(uint256 amount) external override whenNotPaused {
        uint256 total = 0;
        for (uint256 i = 0; i < _donations[msg.sender].length; i++) {
            total += _donations[msg.sender][i].amount;
        }
        require(total >= amount, "Insufficient balance");
        // Remove donations until amount is covered
        uint256 remaining = amount;
        uint256 j = 0;
        while (remaining > 0 && j < _donations[msg.sender].length) {
            Donation storage d = _donations[msg.sender][j];
            if (d.amount <= remaining) {
                remaining -= d.amount;
                d.amount = 0;
            } else {
                d.amount -= remaining;
                remaining = 0;
            }
            j++;
        }
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed...");
        emit Withdrawal(msg.sender, amount);
    }

    // Pause contract (only owner)
    function pause() external onlyOwner whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    // Unpause contract (only owner)
    function unpause() external onlyOwner whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    // Check if contract is paused
    function isPaused() external view returns (bool) {
        return _paused;
    }
}
