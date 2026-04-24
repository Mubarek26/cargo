import { API_BASE_URL } from "@/lib/api";

export const proposalService = {
  async submitProposal(orderId: string, payload: { proposedPrice: number; message?: string; estimatedPickupDate?: string; vehicleDetails?: string }) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async listOrderProposals(orderId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/proposals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async listMyProposals() {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/proposals/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async acceptProposal(orderId: string, proposalId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/proposals/${proposalId}/accept`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async rejectProposal(orderId: string, proposalId: string, reason?: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/proposals/${proposalId}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    return response.json();
  },

  async withdrawProposal(orderId: string, proposalId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/proposals/${proposalId}/withdraw`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
