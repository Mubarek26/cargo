import * as React from "react";
import { getDriverApplication } from "@/services/driverService";

export type DriverApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

type StatusResult = {
  status: DriverApplicationStatus | null;
  notFound: boolean;
  data: Record<string, unknown> | null;
};

export function useDriverApplicationStatus() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [status, setStatus] = React.useState<DriverApplicationStatus | null>(null);
  const [data, setData] = React.useState<Record<string, unknown> | null>(null);

  const fetchStatus = React.useCallback(async (token: string): Promise<StatusResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getDriverApplication(token);
      const resultData = result.data as Record<string, unknown> | null;
      setData(resultData);

      if (result.status === 404) {
        setStatus(null);
        return { status: null, notFound: true, data: resultData };
      }

      if (!result.ok) {
        setStatus("PENDING");
        return { status: "PENDING", notFound: false, data: resultData };
      }

      const rawStatus =
        (resultData as any)?.data?.application?.status ||
        (resultData as any)?.application?.status ||
        (resultData as any)?.status ||
        null;

      const resolvedStatus = rawStatus ? String(rawStatus).toUpperCase() : null;
      if (resolvedStatus === "APPROVED" || resolvedStatus === "REJECTED" || resolvedStatus === "PENDING") {
        setStatus(resolvedStatus);
        return { status: resolvedStatus, notFound: false, data: resultData };
      }

      setStatus(null);
      return { status: null, notFound: false, data: resultData };
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unable to load status.");
      setError(errorObj);
      setStatus("PENDING");
      return { status: "PENDING", notFound: false, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchStatus, isLoading, error, status, data };
}
