
// Declaração global para window.ethereum
declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}

import React from "react";
import { useTranslation } from 'react-i18next';
import { ethers } from "ethers";

const walletIcon = (
  <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2m2-4h-6m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </svg>
);

const ConnectWallet: React.FC<{ onConnect: (address: string | null) => void, address: string | null }> = ({ onConnect, address }) => {
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

  const { t } = useTranslation();
  if (address) {
    return (
      <button
        className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-lg transition-all duration-200 border-2 border-red-400 bg-gradient-to-r from-red-400 to-red-600 text-white hover:scale-105 hover:shadow-xl"
        onClick={() => onConnect(null)}
        style={{ minWidth: 180 }}
      >
        <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>{t('disconnect_wallet', 'Sair')}</span>
      </button>
    );
  }
  return (
    <button
      className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-lg transition-all duration-200 border-2 border-primary bg-gradient-to-r from-primary to-blue-600 text-white hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
      onClick={handleConnect}
      style={{ minWidth: 180 }}
    >
      {walletIcon}
      <span>{t('connect_wallet', 'Conectar Carteira')}</span>
    </button>
  );
};

export default ConnectWallet;
