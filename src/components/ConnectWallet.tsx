
// Declaração global para window.ethereum
declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}

import React from "react";
import { ethers } from "ethers";

const walletIcon = (
  <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2m2-4h-6m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </svg>
);

const ConnectWallet: React.FC<{ onConnect: (address: string) => void, address: string | null }> = ({ onConnect, address }) => {
  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        onConnect(accounts[0]);
      } catch (err) {
        alert("Erro ao conectar carteira: " + (err as Error).message);
      }
    } else {
      alert("MetaMask não encontrada. Instale a extensão para continuar.");
    }
  };

  return (
    <button
      className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-lg transition-all duration-200 border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary/50
        ${address ? 'bg-gradient-to-r from-green-500 to-green-700 text-white cursor-default' : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:scale-105 hover:shadow-xl'}`}
      onClick={handleConnect}
      disabled={!!address}
      style={{ minWidth: 180 }}
    >
      {walletIcon}
      {address ? (
        <span className="truncate">Carteira: {address.slice(0, 6)}...{address.slice(-4)}</span>
      ) : (
        <span>Conectar Carteira</span>
      )}
    </button>
  );
};

export default ConnectWallet;
