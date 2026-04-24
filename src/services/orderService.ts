import { API_BASE_URL } from "@/lib/api";

export interface CreateOrderPayload {
  title: string;
  description?: string;
  pickupDate: string;
  deliveryDeadline?: string;
  proposedBudget: number;
  currency?: string;
  paymentMethod?: string;
  negotiable?: boolean;
  assignmentMode?: 'DIRECT_COMPANY' | 'DIRECT_PRIVATE_TRANSPORTER' | 'OPEN_MARKETPLACE';
  targetCompanyId?: string;
  targetTransporterId?: string;
  pickupLocation: {
    address: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    contactName?: string;
    contactPhone?: string;
  };
  deliveryLocation: {
    address: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    contactName?: string;
    contactPhone?: string;
  };
  cargo: {
    type: string;
    description?: string;
    weightKg: number;
    quantity: number;
    unit?: string;
    specialHandling?: string[];
  };
  vehicleRequirements?: {
    vehicleType?: string;
    minimumCapacityKg?: number;
  };
  specialInstructions?: string;
}

export const orderService = {
  createOrder: async (payload: CreateOrderPayload) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/marketplace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    return response.json();
  },

  getMyOrders: async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  },

  acceptOrder: async (orderId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/accept`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to accept order");
    }

    return response.json();
  },

  rejectOrder: async (orderId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reject order");
    }

    return response.json();
  },

  getOrder: async (orderId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }

    return response.json();
  },

  assignOrder: async (orderId: string, driverId: string, vehicleId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ driverId, vehicleId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to assign order");
    }

    return response.json();
  },
};
