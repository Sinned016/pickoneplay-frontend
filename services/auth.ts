import { LoginFormData } from "@/types/LoginFormData";
import { RegisterFormData } from "@/types/RegisterFormData";

export async function RegisterAccount(data: RegisterFormData) {
  console.log("STEP 1");

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Register failed");
  }

  return responseData;
}

export async function LoginAccount(data: LoginFormData) {
  console.log("STEP 1");

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Login failed");
  }

  return responseData;
}

export async function LogoutAccount(data: LoginFormData) {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}