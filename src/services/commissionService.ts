import { API_BASE_URL } from "@/lib/api";

export interface CommissionConfigData {
  commissionRate: number;
  driverCommissionRate: number;
}

export const commissionService = {
  getConfig: async (): Promise<CommissionConfigData> => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/config/commission`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch commission configuration");
    const data = await response.json();
    return data.data;
  },

  updateConfig: async (config: Partial<CommissionConfigData>) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/config/commission`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update commission configuration");
    }

    return response.json();
  },
};
