import { API_BASE_URL } from "@/lib/api";

export interface Transaction {
  _id: string;
  trx_ref: string;
  status: string;
  amount: number;
  orderId: string;
  companyId?: {
    _id: string;
    companyName: string;
    email: string;
  };
  shipperId?: {
    _id: string;
    fullName: string;
    email: string;
  };
  commission: number;
  companyShare: number;
  driverCommission: number;
  createdAt: string;
}

export const transactionService = {
  getAllTransactions: async (companyId?: string) => {
    const token = localStorage.getItem("authToken");
    let url = `${API_BASE_URL}/api/v1/transactions`;
    if (companyId) {
      url += `?companyId=${companyId}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return response.json();
  },

  getTransactionByRef: async (txRef: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/transactions/${txRef}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transaction details");
    }

    return response.json();
  },
};
