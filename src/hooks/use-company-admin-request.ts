import * as React from "react";
import {
  submitCompanyRequest,
  type CompanyRequestPayload,
} from "@/services/companyService";

export type { CompanyRequestPayload };

export function useCompanyAdminRequest() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<Record<string, unknown> | null>(null);

  const submitRequest = React.useCallback(
    async (token: string, payload: CompanyRequestPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await submitCompanyRequest(token, payload);
        setData(response);
        return response;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error("Request failed.");
        setError(errorObj);
        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { submitRequest, isLoading, error, data };
}
