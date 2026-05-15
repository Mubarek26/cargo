import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { proposalService } from "@/services/proposalService";
import { getDriverApplication } from "@/services/driverService";
import { getCompanyVehicles } from "@/services/vehicleService";

export const MARKETPLACE_KEYS = {
  all: ["marketplace"] as const,
  orders: () => [...MARKETPLACE_KEYS.all, "orders"] as const,
  myPostings: () => [...MARKETPLACE_KEYS.all, "myPostings"] as const,
  proposals: () => [...MARKETPLACE_KEYS.all, "proposals"] as const,
  driverApp: () => [...MARKETPLACE_KEYS.all, "driverApp"] as const,
  vehicles: () => [...MARKETPLACE_KEYS.all, "vehicles"] as const,
};

export function useMarketplaceOrders() {
  return useQuery({
    queryKey: MARKETPLACE_KEYS.orders(),
    queryFn: async () => {
      const res = await orderService.getMarketplaceOrders();
      if (res.status !== "success") throw new Error("Failed to fetch marketplace orders");
      return res.data.orders || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMyPostings() {
  return useQuery({
    queryKey: MARKETPLACE_KEYS.myPostings(),
    queryFn: async () => {
      const res = await orderService.getMyOrders();
      if (res.status !== "success") throw new Error("Failed to fetch my postings");
      return res.data.orders.filter((o: any) => o.assignmentMode === 'OPEN_MARKETPLACE') || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useMyProposals() {
  return useQuery({
    queryKey: MARKETPLACE_KEYS.proposals(),
    queryFn: async () => {
      const res = await proposalService.listMyProposals();
      if (res.status !== "success") throw new Error("Failed to fetch my proposals");
      return res.data.proposals || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useDriverApp() {
  const token = localStorage.getItem("authToken") || "";
  const role = localStorage.getItem("userRole");
  
  return useQuery({
    queryKey: MARKETPLACE_KEYS.driverApp(),
    queryFn: async () => {
      const res = await getDriverApplication(token);
      if (!res.ok) throw new Error("Failed to fetch driver application");
      return res.data?.data?.application || null;
    },
    enabled: role === "DRIVER" || role === "PRIVATE_TRANSPORTER",
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCompanyVehiclesQuery() {
  const token = localStorage.getItem("authToken") || "";
  const role = localStorage.getItem("userRole");

  return useQuery({
    queryKey: MARKETPLACE_KEYS.vehicles(),
    queryFn: async () => {
      const res = await getCompanyVehicles(token);
      if (!res.ok) throw new Error("Failed to fetch company vehicles");
      return res.data?.data?.vehicles || [];
    },
    enabled: role === "COMPANY_ADMIN",
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
