"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-[#E8DDD8] bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF4EE] text-4xl"
            aria-hidden="true"
          >
            ✓
          </div>

          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
            ADDIS EATS
          </p>

          <h1
            className="text-4xl font-bold text-[#7A263A] sm:text-5xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Order Confirmed!
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-[#666666]">
            Thank you for ordering from Addis Eats. Your order has been
            received successfully.
          </p>

          <div className="mt-8 rounded-2xl bg-[#F1E2E5] p-5">
            <p className="font-bold text-[#7A263A]">
              Your order is being prepared.
            </p>

            {orderId && (
              <p className="mt-2 text-sm text-[#666666]">
                Order ID: <span className="font-semibold">{orderId}</span>
              </p>
            )}

            <p className="mt-2 text-sm text-[#666666]">
              We will use your phone number and delivery address to process
              your order.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {orderId && (
              <Link
                href={`/track/${encodeURIComponent(orderId)}`}
                className="rounded-xl bg-[#176B4D] px-6 py-3 font-bold text-white transition hover:bg-[#12563D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#176B4D]"
              >
                Track Order
              </Link>
            )}

            <Link
              href="/orders"
              className="rounded-xl border-2 border-[#7A263A] px-6 py-3 font-bold text-[#7A263A] transition hover:bg-[#F1E2E5]"
            >
              View My Orders
            </Link>

            <Link
              href="/menu"
              className="rounded-xl bg-[#7A263A] px-6 py-3 font-bold text-white transition hover:bg-[#A64B5D]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutSuccessPage;
