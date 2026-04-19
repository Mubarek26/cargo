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
