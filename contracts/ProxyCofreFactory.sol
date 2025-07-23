// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./Cofre.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ProxyCofreFactory is ReentrancyGuard {
    uint256 public constant MAX_TX = 100;
    address[] public cofres;
    mapping(address => address) public clienteToCofre;
    uint256 public txCount;
    address public currentCofre;
    address public owner;

    event NovoCofre(address cofre);
    event NovaTransacao(address cliente, address cofre, uint256 txCount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        _criarNovoCofre();
    }

    function _criarNovoCofre() internal {
        Cofre novo = new Cofre();
        currentCofre = address(novo);
        cofres.push(currentCofre);
        txCount = 0;
        emit NovoCofre(currentCofre);
    }

    function getCofres() external view returns (address[] memory) {
        return cofres;
    }

    function getCurrentCofre() public view returns (address) {
        return currentCofre;
    }

    function registrarTransacao(address cliente) external nonReentrant {
        require(currentCofre != address(0), "Nenhum cofre ativo");
        require(cliente != address(0), "Cliente invalido");
        clienteToCofre[cliente] = currentCofre;
        txCount++;
        emit NovaTransacao(cliente, currentCofre, txCount);
        if (txCount >= MAX_TX) {
            _criarNovoCofre();
        }
    }

    // Função administrativa para o owner forçar a criação de um novo cofre
    function forcarNovoCofre() external onlyOwner nonReentrant {
        _criarNovoCofre();
    }

    // Função administrativa para remover um cofre do array (caso necessário)
    function removerCofre(uint256 index) external onlyOwner nonReentrant {
        require(index < cofres.length, "Index invalido");
        for (uint256 i = index; i < cofres.length - 1; i++) {
            cofres[i] = cofres[i + 1];
        }
        cofres.pop();
    }
}
