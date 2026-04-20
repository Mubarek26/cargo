import { API_BASE_URL } from "@/lib/api";

export const getAllVehicles = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/vehicles/all`, {
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

export const getCompanyVehicles = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/vehicles`, {
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

export type CreateVehiclePayload = {
  plateNumber: string;
  vehicleType: string;
  model: string;
  capacityKg: number;
};

export const createVehicle = async (token: string, payload: CreateVehiclePayload) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/vehicles`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};
