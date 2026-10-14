"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/app/actions";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const result = await register(formData);

      if (!result.success) {
        setError(result.error || "Unable to create account.");
        return;
      }

      router.replace("/orders");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-[#E8DDD8] bg-white p-7 shadow-sm sm:p-9">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
              <Image
                src="/logo.png"
                alt="Addis Eats logo"
                width={38}
                height={38}
                priority
                className="mr-1 inline-block align-middle"
              />
              ADDIS EATS
            </p>

            <h1
              className="mt-3 text-4xl font-bold text-[#7A263A]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Create Account
            </h1>

            <p className="mt-3 text-[#666666]">
              Join Addis Eats to manage your orders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-semibold text-[#2F2F2F]"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-semibold text-[#2F2F2F]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-semibold text-[#2F2F2F]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block font-semibold text-[#2F2F2F]"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
                placeholder="Enter your password again"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-[#F1E2E5] px-4 py-3 text-sm font-medium text-[#7A263A]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-[#7A263A] px-5 py-3.5 font-bold text-white transition hover:bg-[#A64B5D] disabled:opacity-60"
            >
              {pending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#666666]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#7A263A] hover:text-[#A64B5D]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
