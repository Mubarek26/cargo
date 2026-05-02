import { API_BASE_URL } from "@/lib/api";

export type DriverApplicationPayload = {
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  vehicleType: string;
  vehicleRegistrationNumber: string;
  driversLicenseNumber: string;
  licenseExpiryDate: string;
  yearsOfExperience: string;
  availability: string;
  notes?: string;
  vehicleModel?: string;
  vehicleCapacityKg?: string;
  nationalIdOrPassportFile: File;
  driversLicenseImageFile: File;
  profilePhotoFile: File;
};

export const submitDriverApplication = async (token: string, payload: DriverApplicationPayload) => {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("contactNumber", payload.contactNumber);
  formData.append("email", payload.email);
  formData.append("address", payload.address);
  formData.append("vehicleType", payload.vehicleType);
  formData.append("vehicleRegistrationNumber", payload.vehicleRegistrationNumber);
  formData.append("driversLicenseNumber", payload.driversLicenseNumber);
  formData.append("licenseExpiryDate", payload.licenseExpiryDate);
  formData.append("nationalIdOrPassportImage", payload.nationalIdOrPassportFile);
  formData.append("nationalIdOrPassport", payload.nationalIdOrPassportFile.name);
  formData.append("yearsOfExperience", payload.yearsOfExperience);
  formData.append("availability", payload.availability);
  formData.append("driversLicenseImage", payload.driversLicenseImageFile);
  formData.append("profilePhoto", payload.profilePhotoFile);

  if (payload.notes) {
    formData.append("notes", payload.notes);
  }
  if (payload.vehicleModel) {
    formData.append("vehicleModel", payload.vehicleModel);
  }
  if (payload.vehicleCapacityKg) {
    formData.append("vehicleCapacityKg", payload.vehicleCapacityKg);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/private-transporter/apply`, {
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

export const getDriverApplication = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/private-transporter/my-application`, {
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

export const getPrivateTransporters = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/private-transporter`, {
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

export const getAllDrivers = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/drivers/all`, {
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

export const getCompanyDrivers = async (token: string, companyId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/${companyId}/drivers`, {
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

export const updatePrivateTransporterStatus = async (
  token: string,
  transporterId: string,
  status: "pending" | "approved" | "rejected"
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/private-transporter/${transporterId}/status`, {
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
      "Unable to update transporter status.";
    throw new Error(String(message));
  }

  return data as Record<string, unknown> | null;
};
export const streamLocation = async (token: string, payload: { tripId: string; location: any; speed?: number; heading?: number }) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/location`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Unable to update location.";
    throw new Error(String(message));
  }

  return data;
};

export const updateMyStatus = async (token: string, payload: { status: string }) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Unable to update driver status.";
    throw new Error(String(message));
  }

  return data;
};
export const acceptAssignment = async (token: string, orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/assignments/${orderId}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(response);
};

export const rejectAssignment = async (token: string, orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/assignments/${orderId}/reject`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(response);
};

export const startAssignment = async (token: string, orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/assignments/${orderId}/start`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(response);
};

export const arriveAssignment = async (token: string, orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/assignments/${orderId}/arrive`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(response);
};

export const completeAssignment = async (token: string, orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/assignments/${orderId}/complete`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return handleResponse(response);
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && data.message) || "Action failed");
  }
  return data;
};

export const updateDriver = async (token: string, id: string, payload: any) => {
  const formData = new FormData();
  if (payload.fullName) formData.append("fullName", payload.fullName);
  if (payload.phoneNumber) formData.append("phoneNumber", payload.phoneNumber);
  if (payload.email) formData.append("email", payload.email);
  if (payload.licenseNumber) formData.append("licenseNumber", payload.licenseNumber);
  if (payload.status) formData.append("status", payload.status);
  if (payload.driverPhotoFile) formData.append("driverPhoto", payload.driverPhotoFile);
  if (payload.licensePhotoFile) formData.append("licensePhoto", payload.licensePhotoFile);

  const response = await fetch(`${API_BASE_URL}/api/v1/company/drivers/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};

export const addDriver = async (token: string, companyId: string, payload: any) => {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("licenseNumber", payload.licenseNumber);
  if (payload.driverPhotoFile) formData.append("driverPhoto", payload.driverPhotoFile);
  if (payload.licensePhotoFile) formData.append("licensePhoto", payload.licensePhotoFile);

  const response = await fetch(`${API_BASE_URL}/api/v1/company/${companyId}/drivers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};

export const deleteDriver = async (token: string, id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/company/drivers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  return {
    ok: response.ok,
    status: response.status,
    data: null,
  } as const;
};

export const setPrivateTransporterByUser = async (token: string, userId: string, isPrivate: boolean) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/by-user/${userId}/private-transporter`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ isPrivateTransporter: !!isPrivate }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error((data && data.message) || 'Failed to update driver');
  return data as any;
};

export const assignDriverToCompanyByUser = async (token: string, userId: string, companyId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver/by-user/${userId}/assign-company`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ companyId }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error((data && data.message) || 'Failed to assign driver to company');
  return data as any;
};
