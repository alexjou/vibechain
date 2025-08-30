
// File: contracts/IControl.sol


pragma solidity ^0.8.19;

interface IControl {

    function donate(
        address donator,
        uint256 value,
        string calldata message
    ) external payable;

    function setTask(
        string calldata tipo,
        string calldata descr,
        uint256 value,
        uint256 area,
        string calldata georef
    ) external;

    function checkTask(uint256 id) external; // check if task is finished

    function auditTask(
        uint256 id,
        string calldata comments
    ) external;

    function depositExternal(
        string calldata message
    ) external payable;

    function checkBalance(address user) external view returns (uint256);

    function checkCoopBalance(address user) external view returns (uint256);

    function withdraw(uint256 amount) external;
}

// File: contracts/Cooperative.sol


pragma solidity ^0.8.19;


contract Cooperative {
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
        IControl(_vaultAddress).depositExternal{value: msg.value}(message);
        emit OwnerDeposit(msg.sender, msg.value, message);
    }
}
