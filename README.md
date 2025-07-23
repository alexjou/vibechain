## VibeChain

> Plataforma de doações via blockchain Ethereum para crianças com câncer.

## Sobre o Projeto

O **VibeChain** é um projeto revolucionário baseado em blockchain dedicado a apoiar crianças com câncer. Através de doações feitas em criptomoeda (ETH), unimos tecnologia e solidariedade para promover mensagens positivas e esperança. Toda doação é transparente, auditável e registrada na blockchain.

- Interface moderna, responsiva e animada (React + TypeScript + Tailwind CSS)
- Contratos inteligentes seguros (Solidity, OpenZeppelin)
- Integração com carteira Ethereum (MetaMask)
- Transparência total: saldo do cofre, histórico e rotação automática de contratos

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+
- npm 9+
- Carteira Ethereum (MetaMask ou compatível)

### Instalação

```bash
npm install
```

### Rodando o frontend

```bash
npm run dev
```
Acesse: [http://localhost:5173](http://localhost:5173)

### Deploy/Build

```bash
npm run build
```

### Contratos inteligentes
Os contratos Solidity estão na pasta `contracts/`. Para compilar e testar, utilize o [Remix IDE](https://remix.ethereum.org/) ou seu framework favorito (ex: Hardhat).

## Funcionalidades
- Conectar carteira Ethereum
- Visualizar saldo do cofre solidário
- Doar qualquer valor em ETH
- Mensagens de sucesso/erro (toast)
- Cards de impacto social animados
- Layout inspirado em sites modernos de impacto social

## Tecnologias
- React, TypeScript, Vite
- Tailwind CSS
- ethers.js
- Solidity, OpenZeppelin
- AOS, Framer Motion (animações)

## Licença
MIT
