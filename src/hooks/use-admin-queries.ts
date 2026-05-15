import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export const ADMIN_KEYS = {
  all: ["admin"] as const,
  users: () => [...ADMIN_KEYS.all, "users"] as const,
};

export function useAllUsers(params: { page?: number; limit?: number; role?: string } = {}) {
  const userRole = localStorage.getItem("userRole");
  
  return useQuery({
    queryKey: [...ADMIN_KEYS.users(), params],
    queryFn: async () => {
      const res = await userService.getAllUsers(params);
      if (res.status !== "success") throw new Error("Failed to fetch users");
      return res;
    },
    enabled: userRole === "SUPER_ADMIN" || userRole === "superadmin",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
