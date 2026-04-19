import * as React from "react";
import {
  submitDriverApplication,
  type DriverApplicationPayload,
} from "@/services/driverService";

export type { DriverApplicationPayload };

export function useDriverApplication() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<Record<string, unknown> | null>(null);

  const submitApplication = React.useCallback(
    async (token: string, payload: DriverApplicationPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await submitDriverApplication(token, payload);
        setData(response);
        return response;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error("Submission failed.");
        setError(errorObj);
        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { submitApplication, isLoading, error, data };
}
