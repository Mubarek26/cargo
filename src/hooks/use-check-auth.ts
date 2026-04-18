import * as React from "react";
import { API_BASE_URL } from "@/lib/api";

type CheckAuthResult = {
  isAuthenticated: boolean;
  data?: Record<string, unknown> | null;
};

export function useCheckAuth() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  const checkAuth = React.useCallback(async (): Promise<CheckAuthResult> => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return { isAuthenticated: false };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/check-auth`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
        }
        setIsAuthenticated(false);
        return { isAuthenticated: false, data };
      }

      const role = (data as any)?.data?.user?.role || (data as any)?.user?.role;
      if (role) {
        localStorage.setItem("userRole", role);
      }

      setIsAuthenticated(true);
      return { isAuthenticated: true, data };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { checkAuth, isLoading, isAuthenticated };
}
