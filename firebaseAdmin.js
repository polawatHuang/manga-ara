// Replaced Firebase Admin with backend API verification
import { cookies } from "next/headers";

export const verifyAuth = async () => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) throw new Error("No token");

    // Call backend API to verify session
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) throw new Error("Invalid token");
    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
};