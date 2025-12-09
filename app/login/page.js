"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Ensure modal is always open

  useEffect(() => {
    setIsOpen(true); // Keep the modal open
  }, []);

  // Automatically redirect logged-in users to /admin if token is valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) router.push("/admin");
      });
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Login failed");
        setLoading(false);
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/admin");
    } catch (err) {
      setError("Login failed");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: "url('/images/bg-girl.jpg')",
        backgroundSize: "cover",
      }}
    >
      {/* Headless UI Modal */}
      <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-8 rounded-2xl text-black shadow-xl w-full max-w-md">
            <Dialog.Title className="text-2xl font-semibold text-center mb-4">
              Login
            </Dialog.Title>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-solid border-gray-300 rounded-md p-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-solid border-gray-300 rounded-md p-2"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-blue-500 hover:bg-blue-600 py-2 text-white"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </form>

            <hr className="my-4" />

            <Link
              href="/"
              className="w-full pt-2 text-gray-500 flex gap-2 items-center hover:no-underline"
              disabled={loading}
            >
              <ChevronLeftIcon className="size-5" /> Go back to homepage
            </Link>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
