import { API_BASE_URL } from "@/lib/api";

export type LoginPayload = {
  email?: string;
  phoneNumber?: string;
  password: string;
};

export type SignupPayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role?: string;
  photo?: File | null;
};

export type AuthResponse = Record<string, unknown> | null;

const buildSignupRequest = (payload: SignupPayload) => {
  if (payload.photo) {
    const form = new FormData();
    form.append("fullName", payload.fullName);
    form.append("phoneNumber", payload.phoneNumber);
    form.append("email", payload.email);
    form.append("password", payload.password);
    if (payload.passwordConfirm) {
      form.append("passwordConfirm", payload.passwordConfirm);
    }
    if (payload.role) {
      form.append("role", payload.role);
    }
    form.append("photo", payload.photo);
    return { body: form } as const;
  }

  const { photo, ...rest } = payload;
  return {
    body: JSON.stringify(rest),
    headers: { "Content-Type": "application/json" },
  } as const;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Login failed. Please try again.";
    throw new Error(String(message));
  }

  return data;
};

export const signup = async (payload: SignupPayload): Promise<AuthResponse> => {
  const request = buildSignupRequest(payload);
  const response = await fetch(`${API_BASE_URL}/api/v1/users/signup`, {
    method: "POST",
    headers: request.headers,
    body: request.body,
  });

  const data: AuthResponse = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
      "Signup failed. Please try again.";
    throw new Error(String(message));
  }

  return data;
};

export const checkAuth = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/check-auth`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  } as const;
};
