"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/app/actions";
import { useCart } from "./Providers";
import CartDrawer from "./CartDrawer";
import Image from "next/image";

function Header({ customer }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    cartCount,
    cartOpen,
    closeCartDrawer,
  } = useCart();

  function handleLogout() {
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  }

  return (
    <>
      <header className="border-b border-[#E5D8C7] bg-[#F2E8D5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          
          <Link href="/" className="flex items-center gap-3">
  <Image
    src="/logo.png"
    alt="Addis Eats logo"
    width={48}
    height={48}
    priority
    className="h-12 w-12 rounded-full object-contain"
  />

  <span
    className="text-xl font-bold text-[#7A263A]"
    style={{ fontFamily: "Georgia, serif" }}
  >
    Addis Eats
  </span>
</Link>

          <nav className="flex items-center gap-3 sm:gap-7">
            <Link
              href="/"
              className="font-semibold text-[#2F2F2F] transition hover:text-[#7A263A]"
            >
              Home
            </Link>

            <Link
              href="/menu"
              className="font-semibold text-[#2F2F2F] transition hover:text-[#7A263A]"
            >
              Menu
            </Link>

            <Link
              href="/cart"
              className="font-semibold text-[#2F2F2F] transition hover:text-[#7A263A]"
            >
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            <Link
              href="/orders"
              className="font-semibold text-[#2F2F2F] transition hover:text-[#7A263A]"
            >
              Orders
            </Link>

            <Link
              href="/checkout"
              className="font-semibold text-[#2F2F2F] transition hover:text-[#7A263A]"
            >
              Checkout
            </Link>

            {customer ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="rounded-lg border border-[#7A263A] px-4 py-2 font-semibold text-[#7A263A] transition hover:bg-[#7A263A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Signing Out..." : "Sign Out"}
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-[#7A263A] px-4 py-2 font-semibold text-[#7A263A] transition hover:bg-[#7A263A] hover:text-white"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      <CartDrawer
        isOpen={cartOpen}
        onClose={closeCartDrawer}
      />
    </>
  );
}

export default Header;