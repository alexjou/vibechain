import { useContext } from "react";
import { DonationContext } from "../contexts/DonationContextInstance";

export const useDonation = () => {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonation deve ser usado dentro de DonationProvider");
  return ctx;
};
