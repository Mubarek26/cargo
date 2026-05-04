import { API_BASE_URL } from "@/lib/api";

const ROLES_API = `${API_BASE_URL}/api/v1/roles`;
const PERMS_API = `${API_BASE_URL}/api/v1/permissions`;

const authHeaders = (token?: string) => ({ Authorization: `Bearer ${token || localStorage.getItem('authToken')}` });

export const roleService = {
  async getRoles() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(ROLES_API, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  },

  async createRole(payload: { name: string; description?: string; permissions?: string[] }) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(ROLES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },

  async updateRole(roleId: string, payload: any) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${ROLES_API}/${roleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  async deleteRole(roleId: string) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${ROLES_API}/${roleId}`, { method: 'DELETE', headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to delete role');
    return res;
  },

  async assignRole(roleId: string, userId: string) {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${ROLES_API}/${roleId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to assign role');
    return res.json();
  },

  async getPermissions() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(PERMS_API, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  }
};
