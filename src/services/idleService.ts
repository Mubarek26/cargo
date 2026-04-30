import { API_BASE_URL } from "@/lib/api";

export const getAllIdleEvents = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/idle`, {
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

export const resolveIdleEvent = async (token: string, id: string, notes: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/idle/${id}/resolve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ notes }),
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};
