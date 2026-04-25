import { API_BASE_URL } from '../lib/api';

export const getFleetStatus = async () => {
  const token = localStorage.getItem('authToken'); // authService uses authToken
  
  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/fleet-status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data && typeof data === 'object' && 'message' in data && data.message) || 'Failed to fetch fleet status';
    throw new Error(String(message));
  }

  return data;
};
