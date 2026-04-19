import { API_BASE_URL } from "@/lib/api";

export type VendorApplicationPayload = {
  companyName: string;
  contactName: string;
  contactNumber: string;
  email: string;
  address: string;
  businessType: string;
  businessRegistrationNumber: string;
  taxIdNumber: string;
  yearsInBusiness: string;
  website?: string;
  expectedMonthlyOrders: string;
  notes?: string;
  businessLicenseImageFile: File;
  taxIdImageFile: File;
  companyProfileImageFile: File;
};

export const submitVendorApplication = async (token: string, payload: VendorApplicationPayload) => {
  const formData = new FormData();
  formData.append("companyName", payload.companyName);
  formData.append("contactName", payload.contactName);
  formData.append("contactNumber", payload.contactNumber);
  formData.append("email", payload.email);
  formData.append("address", payload.address);
  formData.append("businessType", payload.businessType);
  formData.append("businessRegistrationNumber", payload.businessRegistrationNumber);
  formData.append("taxIdNumber", payload.taxIdNumber);
  formData.append("yearsInBusiness", payload.yearsInBusiness);
  if (payload.website) {
    formData.append("website", payload.website);
  }
  formData.append("expectedMonthlyOrders", payload.expectedMonthlyOrders);
  if (payload.notes) {
    formData.append("notes", payload.notes);
  }
  formData.append("businessLicenseImage", payload.businessLicenseImageFile);
  formData.append("taxIdImage", payload.taxIdImageFile);
  formData.append("companyProfileImage", payload.companyProfileImageFile);

  const response = await fetch(`${API_BASE_URL}/api/v1/vendor/apply`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Unable to submit the application. Please try again.";
    throw new Error(String(message));
  }

  return data as Record<string, unknown> | null;
};

export const getVendorApplication = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/vendor/my-application`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};

export const getVendors = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/vendor`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};

export const updateVendorStatus = async (token: string, vendorId: string, status: "pending" | "approved" | "rejected") => {
  const response = await fetch(`${API_BASE_URL}/api/v1/vendor/${vendorId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Unable to update vendor status.";
    throw new Error(String(message));
  }

  return data as Record<string, unknown> | null;
};
