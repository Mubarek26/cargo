import * as React from "react";
import { API_BASE_URL } from "@/lib/api";

export type LoginPayload = {
  email?: string;
  phoneNumber?: string;
  password: string;
};

type LoginResponse = Record<string, unknown> | null;

export function useLogin() {
  const [isLoading, setIsLoading] = React.useState(false);

  const login = React.useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && "message" in data && data.message) ||
          "Login failed. Please try again.";
        throw new Error(String(message));
      }

      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading };
}
