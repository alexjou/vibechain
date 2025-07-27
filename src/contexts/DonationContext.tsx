import React, { useState, useCallback } from "react";
import { DonationContext } from "./DonationContextInstance";

import { ethers } from "ethers";



const proxyCofreFactoryAddress = "0x0595d3f5EE5cFb8Ba4FC7Bad31846cd264BFA0CC";
// Copied from Home.tsx for correct typing
const proxyABI = [
  { "inputs": [], "name": "forceNewVault", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "maxTx", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "client", "type": "address" }, { "indexed": false, "internalType": "address", "name": "vault", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "transactionCount", "type": "uint256" }], "name": "NewTransaction", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "vault", "type": "address" }], "name": "NewVault", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
  { "inputs": [{ "internalType": "address", "name": "client", "type": "address" }], "name": "registerTransaction", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "removeVault", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getCurrentVault", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getMaxTx", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getVaults", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
];
const bankABI = [
  { "inputs": [{ "internalType": "string", "name": "message", "type": "string" }], "name": "depositExternal", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "message", "type": "string" }], "name": "Deposit", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
  { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }], "name": "Paused", "type": "event" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "by", "type": "address" }], "name": "Unpaused", "type": "event" },
  { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdrawal", "type": "event" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "checkBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getDonations", "outputs": [{ "components": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "string", "name": "message", "type": "string" }], "internalType": "struct Bank.Donation[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "isPaused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
];

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<string>("-");
  const [loadingSaldo, setLoadingSaldo] = useState(false);
  const [donating, setDonating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("-");


  // Fetch the user's wallet balance (ETH)
  const fetchWalletBalance = useCallback(async (addr?: string | null) => {
    try {
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet not found");
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

  // Fetch the vault balance
  const fetchSaldo = useCallback(async () => {
    setLoadingSaldo(true);
    try {
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet not found");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      const proxy = new ethers.Contract(proxyCofreFactoryAddress, proxyABI, provider);
      const vaultAddr = await proxy.getCurrentVault();
      const balanceWei = await provider.getBalance(vaultAddr);
      setSaldo(ethers.formatEther(balanceWei));
    } catch {
      setSaldo("-");
    }
    setLoadingSaldo(false);
  }, []);


  // Handle donation
  const handleDonate = useCallback(async (amount: string, message: string) => {
    setDonating(true);
    try {
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet not found");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const proxy = new ethers.Contract(proxyCofreFactoryAddress, proxyABI, signer);
      const vaultAddr = await proxy.getCurrentVault();
      // Assuming the vault implements Bank
      const bank = new ethers.Contract(vaultAddr, bankABI, signer);
      const tx = await bank.depositExternal(message, { value: ethers.parseEther(amount) });
      await tx.wait();
      setToast({ msg: "Donation sent successfully!", type: "success" });
      fetchSaldo();
    } catch (e) {
      let reason = "";
      if (typeof e === "object" && e && "reason" in e) reason = (e as { reason?: string }).reason ?? "";
      else if (typeof e === "object" && e && "message" in e) reason = (e as { message?: string }).message ?? "";
      setToast({ msg: "Error donating: " + reason, type: "error" });
    }
    setDonating(false);
  }, [fetchSaldo]);

  return (
    <DonationContext.Provider value={{ address, setAddress, saldo, loadingSaldo, donating, toast, setToast, fetchSaldo, handleDonate, walletBalance, fetchWalletBalance }}>
      {children}
    </DonationContext.Provider>
  );
};


