import * as React from "react";
import { checkAuth as checkAuthRequest } from "@/services/authService";

type CheckAuthResult = {
  isAuthenticated: boolean;
  data?: Record<string, unknown> | null;
};

export function useCheckAuth() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [data, setData] = React.useState<Record<string, unknown> | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const checkAuth = React.useCallback(async (): Promise<CheckAuthResult> => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthenticated(false);
      setData(null);
      setIsLoading(false);
      return { isAuthenticated: false };
    }

    try {
      const result = await checkAuthRequest(token);
      setData(result.data as Record<string, unknown> | null);

      if (!result.ok) {
        if (result.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
        }
        setIsAuthenticated(false);
        return { isAuthenticated: false, data: result.data };
      }

      const role =
        (result.data as any)?.data?.user?.role ||
        (result.data as any)?.user?.role;
      if (role) {
        localStorage.setItem("userRole", role);
      }

      setIsAuthenticated(true);
      return { isAuthenticated: true, data: result.data };
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unable to verify session.");
      setError(errorObj);
      setIsAuthenticated(false);
      return { isAuthenticated: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { checkAuth, isLoading, isAuthenticated, error, data };
}
