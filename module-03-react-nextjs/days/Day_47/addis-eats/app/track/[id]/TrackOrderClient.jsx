"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MapPanel from "./MapPanel";
import OrderLiveStatus from "./OrderLiveStatus";
import { etb, when, formatRelativeTime } from "@/lib/format";

const STORAGE_KEY = "addis-eats-orders";

export default function TrackOrderClient({
  orderId,
  username,
  role,
  initialOrder,
}) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [usingLocalOrder, setUsingLocalOrder] = useState(false);

  useEffect(() => {
    function loadOrder() {
      // Prefer the order found by the server.
      if (initialOrder) {
        setOrder(initialOrder);
        setUsingLocalOrder(false);
        setLoading(false);
        return;
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        const savedOrders = Array.isArray(parsed) ? parsed : [];

        const found = savedOrders.find(
          (item) =>
            String(item.id) === String(orderId) &&
            (
              role === "staff" ||
              String(item.customerId).toLowerCase() ===
                String(username).toLowerCase()
            ),
        );

        setOrder(found || null);
        setUsingLocalOrder(Boolean(found));
      } catch (error) {
        console.error("Could not load the saved order:", error);
        setOrder(null);
        setUsingLocalOrder(false);
      }

      setLoading(false);
    }

    loadOrder();

    // Keep the display synchronized with local order changes.
    if (!initialOrder) {
      window.addEventListener("storage", loadOrder);
      window.addEventListener("addis-eats-orders-updated", loadOrder);

      return () => {
        window.removeEventListener("storage", loadOrder);
        window.removeEventListener(
          "addis-eats-orders-updated",
          loadOrder,
        );
      };
    }
  }, [orderId, username, role, initialOrder]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] p-8">
        <p className="text-center text-[#666666]">
          Finding your saved order...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] px-5 py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DDD8] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#7A263A]">
            Order Not Available in This Browser
          </h1>
          <p className="mt-4 text-[#666666]">
            We could not find this order on the server or in this
            browser&apos;s saved order history. Open the same browser
            and profile you used to place the order.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-block rounded-xl bg-[#7A263A] px-6 py-3 font-bold text-white"
          >
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  const placedAt = order.createdAt ? new Date(order.createdAt) : null;
  const validPlacedAt =
    placedAt && !Number.isNaN(placedAt.getTime());

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-[#7A263A] px-6 py-8 shadow-lg sm:px-9 sm:py-10">
          <p className="text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
            ADDIS EATS · DELIVERY TRACKING
          </p>
          <h1
            className="mt-3 text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Track Your Order
          </h1>
          <p className="mt-3 text-[#F1E2E5]">
            Order #{order.id}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-[#E8DDD8] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-[#2F2F2F]">
              Delivery Map
            </h2>

            <MapPanel address={order.address} />

            <div className="mt-5 rounded-xl bg-[#F8F4EC] p-4">
              <h3 className="font-bold text-[#2F2F2F]">
                Delivery Destination
              </h3>
              <p className="mt-1 text-[#666666]">
                {order.address || "No delivery address recorded."}
              </p>
              <p className="mt-2 text-sm text-[#666666]">
                The courier marker is a demonstration location, not live GPS.
                The delivery marker is based on address lookup and may be
                approximate.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2F2F2F]">
                Order Status
              </h2>

              {usingLocalOrder ? (
                <div className="mt-4 rounded-xl bg-[#F8F4EC] p-4">
                  <p className="text-sm text-[#666666]">
                    Saved status in this browser
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#7A263A]">
                    {order.status || "Preparing"}
                  </p>
                  <p className="mt-3 text-sm text-[#666666]">
                    The server could not find this order for its live
                    status stream. This screen is using the order saved
                    by checkout in your browser.
                  </p>
                </div>
              ) : (
                <OrderLiveStatus
                  orderId={String(order.id)}
                  initialStatus={order.status}
                />
              )}

              <div className="mt-5 border-t border-[#E8DDD8] pt-4">
                <p className="text-sm text-[#666666]">Order placed</p>
                <p className="mt-1 font-semibold text-[#2F2F2F]">
                  {validPlacedAt
                    ? when.format(placedAt)
                    : "Date unavailable"}
                </p>
                {validPlacedAt && (
                  <p className="mt-2 text-sm text-[#666666]">
                    {formatRelativeTime(placedAt)}
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2F2F2F]">
                Order Summary
              </h2>

              <ul className="mt-4 space-y-3">
                {(order.items || []).map((item, index) => (
                  <li
                    key={`${item.id ?? item.name}-${index}`}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span className="text-[#666666]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="whitespace-nowrap font-semibold text-[#2F2F2F]">
                      {etb.format(
                        Number(item.price) * Number(item.quantity),
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-3 border-t border-[#E8DDD8] pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#666666]">Subtotal</span>
                  <span className="font-semibold">
                    {etb.format(Number(order.subtotal) || 0)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#666666]">Delivery Fee</span>
                  <span className="font-semibold">
                    {etb.format(Number(order.deliveryFee) || 0)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#E8DDD8] pt-3">
                  <span className="font-bold text-[#2F2F2F]">
                    Total
                  </span>
                  <span className="text-lg font-bold text-[#7A263A]">
                    {etb.format(Number(order.total) || 0)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
