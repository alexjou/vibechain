// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./CrabToken.sol";
import "./Cooperative.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MangueChain
 * @dev Manages cooperative tasks and donations with fee retention and pause control.
 */
contract MangueChain is Ownable, ReentrancyGuard {
    uint256 public constant MAX_MSG_LEN = 256;
    uint256 private _taskCounter;
    bool private _paused;
    uint256 private _retainedFees;
    Crab private _crabToken;

    struct Task {
        Cooperative cop;
        string tipo;
        string descr;
        uint256 value;
        uint256 area;
        string georef;
        bool finished;
        string auditComments;
        bool exists;
    }

    mapping(uint256 => Task) private _tasks;
    mapping(address => Cooperative) private _cooperatives;

    event CooperativeRegistered(address indexed coopAddr, string name);
    event TaskCreated(uint256 indexed id, string tipo, string descr);
    event DonationMade(
        uint256 indexed taskId,
        address indexed donor,
        uint256 value,
        string message
    );
    event DonationReleased(
        uint256 indexed taskId,
        address indexed cooperative,
        uint256 value
    );
    event TaskChecked(uint256 indexed id, bool finished);
    event TaskAudited(uint256 indexed id, string comments);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event Withdrawal(address indexed to, uint256 amount);

    modifier whenNotPaused() {
        require(!_paused, "Contract is paused");
        _;
    }

    modifier whenPaused() {
        require(_paused, "Contract is not paused");
        _;
    }

    constructor(address crabTokenAddress) Ownable(msg.sender) {
        _paused = false;
        _crabToken = Crab(crabTokenAddress);
    }

    /**
     * @dev Deploys and registers a new Cooperative contract.
     */
    function registerCooperative(
        address vault,
        string calldata name_,
        string calldata cnpj_,
        string calldata cpf_,
        string calldata email_
    ) external onlyOwner returns (address) {
        Cooperative coop = new Cooperative(vault, name_, cnpj_, cpf_, email_);
        _cooperatives[address(coop)] = coop;
        emit CooperativeRegistered(address(coop), name_);
        return address(coop);
    }

    /**
     * @dev Creates a new cooperative task.
     */
    function setTask(
        address coopAddr,
        string calldata tipo,
        string calldata descr,
        uint256 area,
        string calldata georef
    ) external onlyOwner whenNotPaused {
        require(
            address(_cooperatives[coopAddr]) != address(0),
            "Unregistered cooperative"
        );

        Cooperative cop = _cooperatives[coopAddr];
        _taskCounter++;
        _tasks[_taskCounter] = Task({
            cop: cop,
            tipo: tipo,
            descr: descr,
            value: 0,
            area: area,
            georef: georef,
            finished: false,
            auditComments: "",
            exists: true
        });

        emit TaskCreated(_taskCounter, tipo, descr);
    }

    /**
     * @dev Users donate to a specific task.
     */

    function donateToTask(uint256 taskId, string calldata message)
        external
        payable
        whenNotPaused
    {
        require(msg.value > 0, "Donation must be > 0");
        require(bytes(message).length <= MAX_MSG_LEN, "Message too long");
        require(_tasks[taskId].exists, "Task does not exist");
        require(!_tasks[taskId].finished, "Task already completed");

        _tasks[taskId].value += msg.value;

       
       // Mint NFT to donor (free)
        _crabToken.mint();

        emit DonationMade(taskId, msg.sender, msg.value, message);
    }

    /**
     * @dev Marks a task as finished and releases 97.5% of donations.
     */
    function checkTask(uint256 id) external onlyOwner whenNotPaused {
        Task storage task = _tasks[id];
        require(task.exists, "Task does not exist");
        require(!task.finished, "Task already finished");

        task.finished = true;

        uint256 total = task.value;
        if (total > 0) {
            uint256 fee = (total * 25) / 1000;
            uint256 payout = total - fee;

            _retainedFees += fee;

            (bool success, ) = payable(address(task.cop)).call{value: payout}(
                ""
            );
            require(success, "Transfer to cooperative failed");

            emit DonationReleased(id, address(task.cop), payout);
        }

        emit TaskChecked(id, true);
    }

    /**
     * @dev Adds audit comments to a task.
     */
    function auditTask(uint256 id, string calldata comments)
        external
        onlyOwner
        whenNotPaused
    {
        require(_tasks[id].exists, "Task does not exist");
        require(bytes(comments).length <= MAX_MSG_LEN, "Comments too long");
        _tasks[id].auditComments = comments;
        emit TaskAudited(id, comments);
    }

    /**
     * @dev Withdraws retained platform fees.
     */
    function withdrawFees() external onlyOwner nonReentrant {
        require(_retainedFees > 0, "No fees to withdraw");

        uint256 amount = _retainedFees;
        _retainedFees = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Fee withdrawal failed");

        emit Withdrawal(owner(), amount);
    }

    /**
     * @dev Returns retained fee balance.
     */
    function retainedFees() external view returns (uint256) {
        return _retainedFees;
    }

    /**
     * @dev Pauses the contract.
     */
    function pause() external onlyOwner whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpauses the contract.
     */
    function unpause() external onlyOwner whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Returns pause state.
     */
    function isPaused() external view returns (bool) {
        return _paused;
    }

    /**
     * @dev Returns cooperative metadata.
     */
    function getCooperativeInfo(address coopAddr)
        external
        view
        onlyOwner
        returns (
            string memory name,
            string memory cnpj,
            string memory cpf,
            string memory email,
            address vault,
            address owner
        )
    {
        Cooperative coop = _cooperatives[coopAddr];
        return (
            coop.getName(),
            coop.getCNPJ(),
            coop.getCPF(),
            coop.getEmail(),
            coop.getVaultAddress(),
            coop.getOwner()
        );
    }

    /**
     * @dev Fallback to receive unexpected Ether.
     */
    receive() external payable {
        _retainedFees += msg.value;
    }
}
