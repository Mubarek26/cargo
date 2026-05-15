import { useQuery } from "@tanstack/react-query";
import { tripService, getTrips, getDelayedTrips } from "@/services/tripService";
import { orderService } from "@/services/orderService";

export const SHIPMENT_KEYS = {
  all: ["shipments"] as const,
  list: () => [...SHIPMENT_KEYS.all, "list"] as const,
  trips: () => [...SHIPMENT_KEYS.all, "trips"] as const,
  myOrders: () => [...SHIPMENT_KEYS.all, "myOrders"] as const,
};

export function useShipments() {
  return useQuery({
    queryKey: SHIPMENT_KEYS.list(),
    queryFn: async () => {
      const res = await orderService.getOrders();
      if (res.status !== "success") throw new Error("Failed to fetch shipments");
      return res.data.orders || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrips(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...SHIPMENT_KEYS.trips(), params],
    queryFn: async () => {
      const res = await getTrips(undefined, params);
      if (!res.ok) throw new Error("Failed to fetch trips");
      return res.data?.data?.trips || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompanyTrips() {
  const role = localStorage.getItem("userRole");
  return useQuery({
    queryKey: [...SHIPMENT_KEYS.trips(), "company"],
    queryFn: async () => {
      const res = await tripService.getCompanyTrips();
      if (!res.ok) throw new Error("Failed to fetch company trips");
      return res.data?.data?.trips || [];
    },
    enabled: role === "COMPANY_ADMIN" || role === "SUPER_ADMIN",
    staleTime: 1000 * 60 * 5,
  });
}

export function useMyOrdersQuery() {
  return useQuery({
    queryKey: SHIPMENT_KEYS.myOrders(),
    queryFn: async () => {
      const res = await orderService.getMyOrders();
      if (res.status !== "success") throw new Error("Failed to fetch my orders");
      return res.data.orders || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useDelayedTrips() {
  return useQuery({
    queryKey: [...SHIPMENT_KEYS.all, "delayed"] as const,
    queryFn: async () => {
      const res = await getDelayedTrips(localStorage.getItem("authToken") || "");
      if (!res.ok) throw new Error("Failed to fetch delayed trips");
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}
