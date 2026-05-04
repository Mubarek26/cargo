import { API_BASE_URL } from "@/lib/api";

const PERMS_API = `${API_BASE_URL}/api/v1/permissions`;

const authHeaders = (token?: string) => ({ Authorization: `Bearer ${token || localStorage.getItem('authToken')}` });

export const permissionService = {
  async getPermissions() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(PERMS_API, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  },

  async createPermission(payload: { key: string; name: string; description?: string }) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(PERMS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to create permission');
    }
    return res.json();
  }
};
