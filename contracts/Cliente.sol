// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./InterfaceICofre.sol";

contract Cliente {
    address public cofreEndereco;
    address public owner;
    event DepositoDoOwner(address indexed ownerAddr, uint256 valor);
    event SaqueDoOwner(address indexed ownerAddr, uint256 valor);

    constructor(address _cofre) {
        require(_cofre != address(0), "Endereco do Cofre nao pode ser zero");
        cofreEndereco = _cofre;
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

    function depositar() external payable onlyOwner {
        require(msg.value > 0, "Precisa enviar algum Ether");
        ICofre(cofreEndereco).depositar{value: msg.value}();
        emit DepositoDoOwner(msg.sender, msg.value);
    }

    function consultarMeuSaldoNoCofre()
        external
        view
        onlyOwner
        returns (uint256)
    {
        return ICofre(cofreEndereco).consultarSaldo(address(this));
    }

    function sacar(uint256 valor) external onlyOwner {
        require(valor > 0, "Valor do saque deve ser maior que zero");
        ICofre cofre = ICofre(cofreEndereco);
        cofre.sacar(valor);
        require(
            address(this).balance >= valor,
            "Cliente nao tem Ether suficiente para repassar do Cofre"
        );
        (bool success, ) = payable(owner).call{value: valor}("");
        require(success, "Repasse do Cliente para o owner falhou!");
        emit SaqueDoOwner(owner, valor);
    }
}
