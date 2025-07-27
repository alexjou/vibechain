import React, { useState, useCallback } from "react";
import { DonationContext } from "./DonationContextInstance";
import type { Fragment, JsonFragment } from "ethers";
import { ethers } from "ethers";



const proxyCofreFactoryAddress = "0x3DCC470bBb6E0BeB81eB5d2DF26dd35E94633b12";
// Copiado de Home.tsx para tipagem correta
const proxyCofreFactoryAbi: readonly (string | Fragment | JsonFragment)[] = [
  { "inputs": [], "name": "forcarNovoCofre", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "cliente", "type": "address" }, { "indexed": false, "internalType": "address", "name": "cofre", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "txCount", "type": "uint256" }], "name": "NovaTransacao", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "cofre", "type": "address" }], "name": "NovoCofre", "type": "event" },
  { "inputs": [{ "internalType": "address", "name": "cliente", "type": "address" }], "name": "registrarTransacao", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "removerCofre", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "clienteToCofre", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "cofres", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "currentCofre", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getCofres", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getCurrentCofre", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "MAX_TX", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "txCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];
const donationAbi = [
  {
    "inputs": [
      { "internalType": "string", "name": "message", "type": "string" }
    ],
    "name": "depositExternal",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "checkBalance",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<string>("-");
  const [loadingSaldo, setLoadingSaldo] = useState(false);
  const [donating, setDonating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("-");

  // Busca o saldo da carteira do usuário (ETH)
  const fetchWalletBalance = useCallback(async (addr?: string | null) => {
    try {
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet não encontrada");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      const userAddr = addr ?? address;
      if (!userAddr) {
        setWalletBalance("-");
        return;
      }
      const balanceWei = await provider.getBalance(userAddr);
      setWalletBalance(ethers.formatEther(balanceWei));
    } catch {
      setWalletBalance("-");
    }
  }, [address]);
  const fetchSaldo = useCallback(async () => {
    setLoadingSaldo(true);
    try {
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet não encontrada");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      const proxy = new ethers.Contract(proxyCofreFactoryAddress, proxyCofreFactoryAbi, provider);
      const cofreAddr = await proxy.getCurrentCofre();
      const saldoWei = await provider.getBalance(cofreAddr);
      setSaldo(ethers.formatEther(saldoWei));
    } catch {
      setSaldo("-");
    }
    setLoadingSaldo(false);
  }, []);

  const handleDonate = useCallback(async (amount: string, message: string) => {
    setDonating(true);
    try {
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet não encontrada");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const proxy = new ethers.Contract(proxyCofreFactoryAddress, proxyCofreFactoryAbi, signer);
      const cofreAddr = await proxy.getCurrentCofre();
      // Supondo que o cofre implementa IDonation
      const donation = new ethers.Contract(cofreAddr, donationAbi, signer);
      const tx = await donation.depositExternal(message, { value: ethers.parseEther(amount) });
      await tx.wait();
      setToast({ msg: "Doação enviada com sucesso!", type: "success" });
      fetchSaldo();
    } catch (e) {
      let reason = "";
      if (typeof e === "object" && e && "reason" in e) reason = (e as { reason?: string }).reason ?? "";
      else if (typeof e === "object" && e && "message" in e) reason = (e as { message?: string }).message ?? "";
      setToast({ msg: "Erro ao doar: " + reason, type: "error" });
    }
    setDonating(false);
  }, [fetchSaldo]);

  return (
    <DonationContext.Provider value={{ address, setAddress, saldo, loadingSaldo, donating, toast, setToast, fetchSaldo, handleDonate, walletBalance, fetchWalletBalance }}>
      {children}
    </DonationContext.Provider>
  );
};


