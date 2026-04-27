import { API_BASE_URL } from "@/lib/api";

export interface PricingConfigData {
  baseFare: number;
  distanceRate: number;
  weightRate: number;
  serviceFee: number;
  taxRate: number;
}

export const pricingService = {
  getConfig: async (): Promise<PricingConfigData> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/pricing-config`);
    if (!response.ok) throw new Error("Failed to fetch pricing configuration");
    const data = await response.json();
    return data.data;
  },

  updateConfig: async (config: PricingConfigData) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/pricing-config`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update pricing configuration");
    }

    return response.json();
  },
};
