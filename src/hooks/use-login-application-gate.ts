import * as React from "react";
import { useCompanyAdminStatus } from "@/hooks/use-company-admin-status";
import { useDriverApplicationStatus } from "@/hooks/use-driver-application-status";
import { useVendorApplicationStatus } from "@/hooks/use-vendor-application-status";

type GateHandlers = {
  onApproved: () => void;
  onCompanyMissing: () => void;
  onCompanyReview: () => void;
  onDriverMissing: () => void;
  onDriverReview: () => void;
  onVendorMissing: () => void;
  onVendorReview: () => void;
};

const normalizeStatus = (value?: string | null) =>
  value ? value.toUpperCase() : null;

export function useLoginApplicationGate() {
  const { fetchStatus } = useCompanyAdminStatus();
  const { fetchStatus: fetchDriverStatus } = useDriverApplicationStatus();
  const { fetchStatus: fetchVendorStatus } = useVendorApplicationStatus();

  const checkApplicationGate = React.useCallback(
    async (role: string | undefined, token: string | null | undefined, handlers: GateHandlers) => {
      if (role === "COMPANY_ADMIN") {
        try {
          if (!token) {
            handlers.onCompanyReview();
            return true;
          }

          const statusResult = await fetchStatus(token);

          if (statusResult.notFound) {
            handlers.onCompanyMissing();
            return true;
          }

          const status = normalizeStatus(statusResult.status);
          if (!status) {
            handlers.onCompanyMissing();
            return true;
          }

          if (status === "APPROVED") {
            handlers.onApproved();
          } else {
            handlers.onCompanyReview();
          }
          return true;
        } catch {
          handlers.onCompanyReview();
          return true;
        }
      }

      if (role === "DRIVER") {
        try {
          if (!token) {
            handlers.onDriverReview();
            return true;
          }

          const statusResult = await fetchDriverStatus(token);

          if (statusResult.notFound) {
            handlers.onDriverMissing();
            return true;
          }

          const status = normalizeStatus(statusResult.status);
          if (!status) {
            handlers.onDriverMissing();
            return true;
          }

          if (status === "APPROVED") {
            handlers.onApproved();
          } else {
            handlers.onDriverReview();
          }
          return true;
        } catch {
          handlers.onDriverReview();
          return true;
        }
      }

      if (role === "VENDOR") {
        try {
          if (!token) {
            handlers.onVendorReview();
            return true;
          }

          const statusResult = await fetchVendorStatus(token);

          if (statusResult.notFound) {
            handlers.onVendorMissing();
            return true;
          }

          const status = normalizeStatus(statusResult.status);
          if (!status) {
            handlers.onVendorMissing();
            return true;
          }

          if (status === "APPROVED") {
            handlers.onApproved();
          } else {
            handlers.onVendorReview();
          }
          return true;
        } catch {
          handlers.onVendorReview();
          return true;
        }
      }

      return false;
    },
    [fetchDriverStatus, fetchStatus, fetchVendorStatus]
  );

  return { checkApplicationGate };
}
