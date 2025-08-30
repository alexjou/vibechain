
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

// File: @openzeppelin/contracts/utils/Context.sol


// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol


// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: @openzeppelin/contracts/security/ReentrancyGuard.sol


// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// File: contracts/MangueChain.sol


pragma solidity ^0.8.20;





contract MangueChain is IControl, Ownable, ReentrancyGuard {
    uint256 public constant MAX_MSG_LEN = 256;

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

    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _coopBalance; // kept to satisfy IControl
    mapping(uint256 => Task) private _tasks;
    uint256 private _taskCounter;
    bool private _paused;

    event Deposit(address indexed from, uint256 amount, string message);
    event Withdrawal(address indexed to, uint256 amount);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event TaskCreated(uint256 indexed id, string tipo, string descr);
    event TaskChecked(uint256 indexed id, bool finished);
    event TaskAudited(uint256 indexed id, string comments);
    event DonationMade(address indexed beneficiary, uint256 value, string message);

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
        emit TaskCreated(_taskCounter, tipo, descr);
    }

    // Marca tarefa como concluída (somente dono)
    function checkTask(uint256 id) external override onlyOwner whenNotPaused {
        require(_tasks[id].exists, "Task does not exist");
        _tasks[id].finished = true;
        emit TaskChecked(id, true);
    }

    // Audita tarefa
    function auditTask(
        uint256 id,
        string calldata comments
    ) external override onlyOwner whenNotPaused {
        require(_tasks[id].exists, "Task does not exist");
        require(bytes(comments).length <= MAX_MSG_LEN, "Comments too long");
        _tasks[id].auditComments = comments;
        emit TaskAudited(id, comments);
    }

    // Depósito externo para si mesmo
    function depositExternal(
        string calldata message
    ) external payable override whenNotPaused {
        require(msg.value > 0, "Send some Ether");
        require(bytes(message).length <= MAX_MSG_LEN, "Message too long");
        _balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, message);
    }

    // Consulta saldo (donos de saldo)
    function checkBalance(
        address user
    ) public view override returns (uint256) {
        return _balances[user];
    }

    // Compatível com IControl; não há lógica definida no escopo atual
    function checkCoopBalance(
        address user
    ) external view override returns (uint256) {
        return _coopBalance[user];
    }

    // Saque
    function withdraw(uint256 amount) external override whenNotPaused nonReentrant {
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

    // Funções de resgate
    function rescueETH(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "Rescue failed");
    }

    function rescueERC20(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(IERC20(token).transfer(to, amount), "Token rescue failed");
    }

    // Receber ETH diretamente
    receive() external payable {
        _balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, "");
    }
}
