import { API_BASE_URL } from "@/lib/api";
import * as mock from "@/mocks/companyWalletMock";

export interface CompanyDriverWallet {
  driverId: string;
  fullName: string;
  balance: number;
  totalEarnings: number;
  phone?: string | null;
  email?: string | null;
}

export interface CompanyTransaction {
  _id: string;
  trx_ref: string;
  amount: number;
  driverCommission: number;
  companyShare?: number;
  status: string;
  createdAt: string;
  ref_id?: string;
}

export const companyWalletService = {
  async getDriversWallets(): Promise<CompanyDriverWallet[]> {
    const useMock = localStorage.getItem("useMock") === "1";
    if (useMock) return mock.getDriversWallets();
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/api/v1/company/drivers/wallets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch drivers wallets");
    const data = await res.json();
    return data.data;
  },

  async getDriverTransactions(driverId: string): Promise<CompanyTransaction[]> {
    const useMock = localStorage.getItem("useMock") === "1";
    if (useMock) return mock.getDriverTransactions(driverId);
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/api/v1/company/drivers/${driverId}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch driver transactions");
    const data = await res.json();
    return data.data;
  },

  async getWithdrawals(): Promise<any[]> {
    const useMock = localStorage.getItem("useMock") === "1";
    if (useMock) return mock.getWithdrawals();
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/api/v1/company/withdrawals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch withdrawals");
    const data = await res.json();
    return data.data;
  },

  async requestWithdraw(driverId: string, payload: { amount: number; note?: string }) {
    const useMock = localStorage.getItem("useMock") === "1";
    if (useMock) return mock.requestWithdraw(driverId, payload as any);
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/api/v1/company/drivers/${driverId}/withdrawals`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async approveWithdraw(withdrawalId: string) {
    const useMock = localStorage.getItem("useMock") === "1";
    if (useMock) return mock.approveWithdraw(withdrawalId as any);
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/api/v1/company/withdrawals/${withdrawalId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
