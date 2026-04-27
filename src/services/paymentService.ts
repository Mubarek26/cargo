import { API_BASE_URL } from "@/lib/api";

export const paymentService = {
  initializePayment: async (orderId: string, phoneNumber: string, currency: string = "ETB") => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/payment/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId,
        phone_number: phoneNumber,
        currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to initialize payment");
    }

    return response.json();
  },

  verifyPayment: async (txRef: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/payment/verify?tx_ref=${txRef}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify payment");
    }

    return response.json();
  },
};
