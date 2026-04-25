import { API_BASE_URL } from "@/lib/api";

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && data.message) || "Action failed");
  }
  return data;
};

export const getAllGeofences = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/geofences`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createGeofence = async (payload: any) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/geofences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteGeofence = async (id: string) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/geofences/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 204) return { status: "success" };
  return handleResponse(response);
};

export const geofenceService = {
  getAllGeofences,
  createGeofence,
  deleteGeofence,
};
