import { API_BASE_URL } from "@/lib/api";

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

export const getTrips = async (token?: string) => {
  const authToken = token || localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/trips`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return handleResponse(response);
};

export const getCompanyTrips = async (token?: string) => {
  const authToken = token || localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/trips/company`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return handleResponse(response);
};

export const getDriverTripsHistory = async (token?: string) => {
  const authToken = token || localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/trips/driver/mine`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return handleResponse(response);
};

export const getTripById = async (token: string, tripId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/trips/${tripId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getTripDetails = async (tripId: string) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/trips/${tripId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch trip details");
  }

  return response.json();
};

export const updateMilestone = async (tripId: string, payload: { milestone: string; location?: { type: string; coordinates: number[] }; note?: string }) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/v1/trips/driver/${tripId}/milestone`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update milestone");
  }

  return response.json();
};

// Legacy object export for compatibility with DriverTrips.tsx and others
export const tripService = {
  getDriverTrips: getDriverTripsHistory,
  updateMilestone,
  getTripDetails,
  getTripById,
  getCompanyTrips,
  getTrips,
};
