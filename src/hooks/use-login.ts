import * as React from "react";
import {
  login as loginRequest,
  type AuthResponse,
  type LoginPayload,
} from "@/services/authService";

export type { LoginPayload };

export function useLogin() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<AuthResponse>(null);

  const login = React.useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginRequest(payload);
      setData(response);
      return response;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Login failed.");
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error, data };
}
