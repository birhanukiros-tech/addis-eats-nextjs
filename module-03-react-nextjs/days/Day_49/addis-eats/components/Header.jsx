"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { logout } from "@/app/actions";
import { useCart } from "./Providers";
import CartDrawer from "./CartDrawer";

function Header({ customer }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasMounted, setHasMounted] = useState(false);

  const { cartCount, cartOpen, closeCartDrawer } = useCart();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  function handleLogout() {
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  }

  // Shared accessible styles for navigation links.
  const linkClass =
    "inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-[#2F2F2F] transition hover:text-[#7A263A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A] sm:text-base";

  // Shared styles for action buttons and emphasized links.
  const actionClass =
    "inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A] sm:px-4 sm:text-base";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#E5D8C7] bg-[#F2E8D5]">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 px-3 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Addis Eats home"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A] sm:gap-3"
          >
            <Image
              src="/logo.png"
              alt=""
              width={48}
              height={48}
              priority
              className="h-10 w-10 rounded-full object-contain sm:h-12 sm:w-12"
            />

            <span
              className="whitespace-nowrap text-lg font-bold text-[#7A263A] sm:text-xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Addis Eats
            </span>
          </Link>

          {/* Main Navigation */}
          <nav
            aria-label="Main navigation"
            className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:gap-x-3 lg:w-auto lg:flex-nowrap lg:justify-end lg:gap-5 xl:gap-7"
          >
            <Link href="/" className={linkClass}>
              Home
            </Link>

            <Link href="/menu" className={linkClass}>
              Menu
            </Link>

            <Link href="/cart" className={linkClass}>
              Cart
              {hasMounted && cartCount > 0 && ` (${cartCount})`}
            </Link>

            <Link href="/orders" className={linkClass}>
              Orders
            </Link>

            <Link href="/checkout" className={linkClass}>
              Checkout
            </Link>

            {/* Admin */}
            <Link
              href="/kitchen"
              className={`${actionClass} bg-[#7A263A] font-bold text-white hover:bg-[#A64B5D]`}
            >
              Admin
            </Link>

            {/* Authentication */}
            {customer ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className={`${actionClass} border border-[#7A263A] text-[#7A263A] hover:bg-[#7A263A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {isPending ? "Signing Out..." : "Sign Out"}
              </button>
            ) : (
              <Link
                href="/login"
                className={`${actionClass} border border-[#7A263A] text-[#7A263A] hover:bg-[#7A263A] hover:text-white`}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Existing Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={closeCartDrawer}
      />
    </>
  );
}

export default Header;