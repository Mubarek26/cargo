import { API_BASE_URL } from "@/lib/api";

export const getTrips = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};

export const getCompanyTrips = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/trips/company`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};

export const getTripById = async (token: string, tripId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/trips/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};

export const getDriverTripsHistory = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/trips/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};
