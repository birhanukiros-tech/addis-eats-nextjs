"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions";

function LoginPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    login,
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/orders");
    }
  }, [state, router]);

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-[#E8DDD8] bg-white p-7 shadow-sm sm:p-9">

          <div className="mb-8 text-center">
            <p className="text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
              ADDIS EATS
            </p>

            <h1
              className="mt-3 text-4xl font-bold text-[#7A263A]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Customer Sign In
            </h1>

            <p className="mt-3 text-[#666666]">
              Sign in to manage your Addis Eats orders.
            </p>
          </div>

          <form action={formAction} className="space-y-5">

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block font-semibold text-[#2F2F2F]"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none transition focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
              />
            </div>

            {/* Password */}
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
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none transition focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
              />
            </div>

            {/* Error */}
            {state?.error && (
              <p className="rounded-xl bg-[#F1E2E5] px-4 py-3 text-sm font-medium text-[#7A263A]">
                {state.error}
              </p>
            )}

            {/* Sign In */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-[#7A263A] px-5 py-3.5 font-bold text-white transition hover:bg-[#A64B5D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;