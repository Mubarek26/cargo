import { API_BASE_URL } from "@/lib/api";

const USERS_API_URL = `${API_BASE_URL}/api/v1/users`;

export const userService = {
  async getAllUsers() {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    console.log(`Fetching users from: ${USERS_API_URL}`);
    const response = await fetch(`${USERS_API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Fetch response status: ${response.status}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch users");
    }
    return response.json();
  },

  async updateUserStatus(userId: string, status: string) {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update user status");
    }
    return response.json();
  },

  async deleteUser(userId: string) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) return { status: "success" };
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete user");
    }
    return response.json();
  },
};
