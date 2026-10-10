
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { login, signInWithGoogle } from "@/app/actions";
import Image from "next/image";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [state, formAction, isPending] = useActionState(login, null);
  const [googleError, setGoogleError] = useState("");
  const [googlePending, setGooglePending] = useState(false);

  function getSafeNext() {
  return (
    next &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    next !== "/kitchen" &&
    !next.startsWith("/kitchen/")
  )
    ? next
    : "/";
}

  useEffect(() => {
  if (!state?.success) return;

  const destination =
    state.role === "staff" ? "/kitchen" : getSafeNext();

  router.replace(destination);
}, [state, router]);

  function handleGoogleScriptLoad() {
    if (!window.google?.accounts?.id) {
      setGoogleError("Google sign-in could not load. Please try again.");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setGoogleError("Google sign-in is not configured.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setGoogleError("");
        setGooglePending(true);

        try {
          const result = await signInWithGoogle(response.credential);

          if (!result.success) {
            setGoogleError(result.error || "Google sign-in failed.");
            return;
          }

          if (result.role === "staff") {
            router.replace("/kitchen");
            return;
          }

          router.replace(getSafeNext());
          router.refresh();
        } catch {
          setGoogleError("Google sign-in failed. Please try again.");
        } finally {
          setGooglePending(false);
        }
      },
    });

    const button = document.getElementById("google-signin-button");

    if (button) {
      button.replaceChildren();

      window.google.accounts.id.renderButton(button, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 300,
      });
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
              Customer Sign In
            </h1>

            <p className="mt-3 text-[#666666]">
              Sign in to manage your Addis Eats orders.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block font-semibold text-[#2F2F2F]"
              >
                Username or email
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Enter your username or email"
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none transition focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
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
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none transition focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/10"
              />
            </div>

            {state?.error && (
              <p
                role="alert"
                className="rounded-xl bg-[#F1E2E5] px-4 py-3 text-sm font-medium text-[#7A263A]"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-[#7A263A] px-5 py-3.5 font-bold text-white transition hover:bg-[#A64B5D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E8DDD8] pt-6">
            <p className="mb-4 text-center text-sm text-[#666666]">
              Or continue with
            </p>

            <Script
              src="https://accounts.google.com/gsi/client"
              strategy="afterInteractive"
              onLoad={handleGoogleScriptLoad}
              onError={() =>
                setGoogleError("Could not load Google's sign-in service.")
              }
            />

            <div className="flex justify-center">
              <div id="google-signin-button" />
            </div>

            {googlePending && (
              <p className="mt-3 text-center text-sm text-[#666666]">
                Signing in with Google...
              </p>
            )}

            {googleError && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-[#F1E2E5] px-4 py-3 text-sm text-[#7A263A]"
              >
                {googleError}
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#7A263A] hover:text-[#A64B5D]"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
