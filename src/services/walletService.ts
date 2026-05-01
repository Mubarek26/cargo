import { API_BASE_URL } from "@/lib/api";

export interface WalletData {
  balance: number;
  totalEarnings: number;
  fullName: string;
}

export interface TransactionRecord {
  _id: string;
  trx_ref: string;
  amount: number;
  driverCommission: number;
  status: string;
  createdAt: string;
}

export const walletService = {
  getDriverWallet: async (): Promise<WalletData> => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/driver/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch wallet information");
    const data = await response.json();
    return data.data;
  },

  getTransactionHistory: async (): Promise<TransactionRecord[]> => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/driver/commission/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch transaction history");
    const data = await response.json();
    return data.data;
  },

  requestWithdraw: async (payload: { amount: number; note?: string }) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/driver/withdrawals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },
  getWithdrawals: async (): Promise<any[]> => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/driver/withdrawals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch withdrawals");
    const data = await response.json();
    return data.data;
  },
};
