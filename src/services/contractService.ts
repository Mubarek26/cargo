import { API_BASE_URL } from "@/lib/api";

export const contractService = {
  async initiateContract(companyId: string, startDate: string, endDate: string, message?: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        transporterCompanyId: companyId,
        startDate,
        endDate,
        message
      }),
    });
    return response.json();
  },

  async getVendorContracts() {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/vendor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getCompanyContracts() {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/company`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async approveContract(contractId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/${contractId}/approve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async terminateContract(contractId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/${contractId}/terminate`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
