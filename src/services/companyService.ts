import { API_BASE_URL } from "@/lib/api";

export type CompanyRequestPayload = {
  companyName: string;
  phoneNumber: string;
  email: string;
  website?: string;
  description: string;
  businessLicense: string;
  photoFile: File;
  numberOfCars: string;
  address: string;
};

export const submitCompanyRequest = async (token: string, payload: CompanyRequestPayload) => {
  const formData = new FormData();
  formData.append("companyName", payload.companyName);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("email", payload.email);
  if (payload.website) {
    formData.append("website", payload.website);
  }
  formData.append("description", payload.description);
  formData.append("businessLicense", payload.businessLicense);
  formData.append("photo", payload.photoFile);
  formData.append("address", payload.address);
  formData.append("numberOfCars", payload.numberOfCars);

  const response = await fetch(`${API_BASE_URL}/api/v1/company`, {
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
      "Unable to submit the request. Please try again.";
    throw new Error(String(message));
  }

  return data as Record<string, unknown> | null;
};

export const getCompanyMe = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/me`, {
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

export const getCompanies = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company`, {
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

export const approveCompany = async (token: string, companyId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/${companyId}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Unable to approve company.";
    throw new Error(String(message));
  }

  return data as Record<string, unknown> | null;
};

export const companyService = {
  getCompanies,
  getCompanyMe,
  approveCompany,
  submitCompanyRequest,
};
