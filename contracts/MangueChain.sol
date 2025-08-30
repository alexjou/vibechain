// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IControl.sol";
import "./Cooperative.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MangueChain is IControl, Ownable, ReentrancyGuard {
    uint256 public constant MAX_MSG_LEN = 256;
     uint256 private _taskCounter;
    bool private _paused;

    struct Task {
        string tipo;
        string descr;
        uint256 value;
        uint256 area;
        string georef;
        bool finished;
        string auditComments;
        bool exists;
    }
    Task[] private tasks ;

    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _coopBalance; // kept to satisfy IControl
    mapping(uint256 => Task) private _tasks;
    mapping (address=> Cooperative)private _cooperatives;
   

    event Deposit(address indexed from, uint256 amount, string message);
    event Withdrawal(address indexed to, uint256 amount);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event TaskCreated(uint256 indexed id, string tipo, string descr);
    event TaskChecked(uint256 indexed id, bool finished);
    event TaskAudited(uint256 indexed id, string comments);
    event DonationMade(
        address indexed beneficiary,
        uint256 value,
        string message
    );

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

    // Doa para um beneficiário específico (compatível com IControl)
    function donate(
        address beneficiary,
        uint256 value,
        string calldata message
    ) external payable override whenNotPaused {
        require(msg.value == value, "Value mismatch");
        require(value > 0, "Donation must be > 0");
        require(bytes(message).length <= MAX_MSG_LEN, "Message too long");
        _balances[beneficiary] += value;
        emit DonationMade(beneficiary, value, message);
    }

    // Cria uma nova tarefa
    function setTask(
        string calldata tipo,
        string calldata descr,
        uint256 value,
        uint256 area,
        string calldata georef
    ) external override onlyOwner whenNotPaused {
        _taskCounter++;
        _tasks[_taskCounter] = Task({
            tipo: tipo,
            descr: descr,
            value: value,
            area: area,
            georef: georef,
            finished: false,
            auditComments: "",
            exists: true
        });
        tasks.push();
        emit TaskCreated(_taskCounter, tipo, descr);
    }

    // Marca tarefa como concluída (somente dono)
    function checkTask(uint256 id) external override onlyOwner whenNotPaused {
        require(_tasks[id].exists, "Task does not exist");
        _tasks[id].finished = true;
        emit TaskChecked(id, true);
    }

    // Audita tarefa
    function auditTask(uint256 id, string calldata comments)
        external
        override
        onlyOwner
        whenNotPaused
    {
        require(_tasks[id].exists, "Task does not exist");
        require(bytes(comments).length <= MAX_MSG_LEN, "Comments too long");
        _tasks[id].auditComments = comments;
        emit TaskAudited(id, comments);
    }

    // Depósito externo para si mesmo
    function depositExternal(string calldata message)
        external
        payable
        override
        whenNotPaused
    {
        require(msg.value > 0, "Send some Ether");
        require(bytes(message).length <= MAX_MSG_LEN, "Message too long");
        _balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, message);
    }

    // Consulta saldo (donos de saldo)
    function checkBalance(address user) public view override returns (uint256) {
        return _balances[user];
    }

    // Compatível com IControl; não há lógica definida no escopo atual
    function checkCoopBalance(address user)
        external
        view
        override
        returns (uint256)
    {
        return _coopBalance[user];
    }

    // Saque
    function withdraw(uint256 amount)
        external
        override
        whenNotPaused
        nonReentrant
    {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawal(msg.sender, amount);
    }

    // Controle de pausa
    function pause() external onlyOwner whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    function isPaused() external view returns (bool) {
        return _paused;
    }

    // Receber ETH diretamente
    receive() external payable {
        _balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, "");
    }
    function getCooperative(address ad)external view onlyOwner returns(Cooperative){
        return _cooperatives[ad];
    }
}
