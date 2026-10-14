"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { logout } from "@/app/actions";
import { useCart } from "./Providers";
import CartDrawer from "./CartDrawer";
import Image from "next/image";

function Header({ customer }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  const { cartCount, cartOpen, closeCartDrawer } = useCart();

  function handleLogout() {
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  }

  const linkClass =
    "whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold text-[#2F2F2F] transition hover:text-[#7A263A] sm:px-3 sm:text-base lg:px-0 lg:py-0";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#E5D8C7] bg-[#F2E8D5]">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 px-3 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-3"
          >
            <Image
              src="/logo.png"
              alt="Addis Eats logo"
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

          {/* Navigation */}
          <nav className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:gap-x-3 lg:w-auto lg:flex-nowrap lg:justify-end lg:gap-5 xl:gap-7">
            <Link href="/" className={linkClass}>
              Home
            </Link>

            <Link href="/menu" className={linkClass}>
              Menu
            </Link>

            <Link href="/cart" className={linkClass}>
              Cart {hasMounted && cartCount > 0 && `(${cartCount})`}
            </Link>

            <Link href="/orders" className={linkClass}>
              Orders
            </Link>

            <Link href="/checkout" className={linkClass}>
              Checkout
            </Link>

            {/* Admin is visible before and after sign-in */}
            <Link
              href="/kitchen"
              className="whitespace-nowrap rounded-lg bg-[#7A263A] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#A64B5D] sm:px-4 sm:text-base"
            >
              Admin
            </Link>

            {customer ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="whitespace-nowrap rounded-lg border border-[#7A263A] px-3 py-2 text-sm font-semibold text-[#7A263A] transition hover:bg-[#7A263A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-base"
              >
                {isPending ? "Signing Out..." : "Sign Out"}
              </button>
            ) : (
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg border border-[#7A263A] px-3 py-2 text-sm font-semibold text-[#7A263A] transition hover:bg-[#7A263A] hover:text-white sm:px-4 sm:text-base"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={closeCartDrawer} />
    </>
  );
}

export default Header;
