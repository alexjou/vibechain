import { createContext } from "react";

export interface DonationContextProps {
  address: string | null;
  setAddress: (addr: string | null) => void;
  saldo: string;
  loadingSaldo: boolean;
  donating: boolean;
  toast: { msg: string; type: "success" | "error" } | null;
  setToast: (toast: { msg: string; type: "success" | "error" } | null) => void;
  fetchSaldo: () => Promise<void>;
  handleDonate: (amount: string, message: string) => Promise<void>;
  walletBalance: string;
  fetchWalletBalance: (addr?: string | null) => Promise<void>;
}

export const DonationContext = createContext<DonationContextProps | undefined>(undefined);
