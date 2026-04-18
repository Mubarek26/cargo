import * as React from "react";
import { API_BASE_URL } from "@/lib/api";

export type SignupPayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role?: string;
  photo?: File | null;
};

type SignupResponse = Record<string, unknown> | null;

type RequestShape = {
  body: BodyInit;
  headers?: Record<string, string>;
};

const buildRequest = (payload: SignupPayload): RequestShape => {
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
    return { body: form };
  }

  const { photo, ...rest } = payload;
  return {
    body: JSON.stringify(rest),
    headers: { "Content-Type": "application/json" },
  };
};

export function useSignup() {
  const [isLoading, setIsLoading] = React.useState(false);

  const signup = React.useCallback(async (payload: SignupPayload) => {
    setIsLoading(true);
    try {
      const request = buildRequest(payload);
      const response = await fetch(`${API_BASE_URL}/api/v1/users/signup`, {
        method: "POST",
        headers: request.headers,
        body: request.body,
      });

      const data: SignupResponse = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && "message" in data && data.message) ||
          "Signup failed. Please try again.";
        throw new Error(String(message));
      }

      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { signup, isLoading };
}
