import React from "react";
import LanguageSelector from './LanguageSelector';
import ConnectWallet from "./ConnectWallet";
import { useDonation } from '../hooks/useDonation';

const vibeLogo = "/vibechain/vibeChain.png";

// Toast de notificação
const Toast: React.FC<{ msg: string; type: 'success' | 'error'; onClose: () => void }> = ({ msg, type, onClose }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-semibold shadow-lg text-white flex items-center gap-3 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
    role="alert">
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 text-white text-xl leading-none">×</button>
  </div>
);

const Header: React.FC<{ toastMsg?: string; toastType?: 'success' | 'error'; onToastClose?: () => void }> = ({ toastMsg, toastType, onToastClose }) => {
  const { address, setAddress, walletBalance } = useDonation();
  return (
    <>
      {/* Toast de notificação */}
      {toastMsg && toastType && onToastClose && (
        <Toast msg={toastMsg} type={toastType} onClose={onToastClose} />
      )}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur shadow-lg flex justify-between items-center px-8 py-4 border-b border-[#a7e9fb]">
        <div className="flex items-center gap-3">
          <img src={vibeLogo} alt="Logo VibeChain" className="w-10 h-10 rounded-lg shadow border-2 border-pink-200 bg-white object-contain" />
          <span className="text-3xl font-extrabold text-pink-500 tracking-tight drop-shadow-sm">VibeChain</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Exibe endereço e saldo quando conectado */}
          {address && (
            <span className="text-base font-semibold text-blue-600 bg-blue-100 rounded-lg px-3 py-1">
              {`${address}: ${walletBalance === "-" ? "..." : `${Number(walletBalance).toFixed(2)} ETH`}`}
            </span>
          )}
          <ConnectWallet onConnect={setAddress} address={address} />
          {/* Seletor de idioma com bandeira */}
          <LanguageSelector />
        </div>
      </header>
    </>
  );
};

export default Header;
