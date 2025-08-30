// SPDX-License-Identifier: MIT
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
