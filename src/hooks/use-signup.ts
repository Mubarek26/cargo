import * as React from "react";
import {
  signup as signupRequest,
  type AuthResponse,
  type SignupPayload,
} from "@/services/authService";

export type { SignupPayload };

export function useSignup() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<AuthResponse>(null);

  const signup = React.useCallback(async (payload: SignupPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signupRequest(payload);
      setData(response);
      return response;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Signup failed.");
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { signup, isLoading, error, data };
}
