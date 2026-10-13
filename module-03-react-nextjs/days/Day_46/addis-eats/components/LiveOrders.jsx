
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "./Providers";
import {
  DISHES_UPDATED_EVENT,
  readBrowserDishes,
} from "@/lib/dish-storage";

const STORAGE_KEY = "addis-eats-orders";

function LiveOrders({ username, initialDishes = [] }) {
  const { addToCart } = useCart();
  const initialDishesRef = useRef(initialDishes);

  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [menuDishes, setMenuDishes] = useState(initialDishes);
  const [reorderMessages, setReorderMessages] = useState({});

  useEffect(() => {
    function loadOrders() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsedOrders = saved ? JSON.parse(saved) : [];

        const customerOrders = (
          Array.isArray(parsedOrders) ? parsedOrders : []
        ).filter(
          (order) =>
            order &&
            String(order.customerId).toLowerCase() ===
              String(username).toLowerCase(),
        );

        customerOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );

        setOrders(customerOrders);
      } catch (error) {
        console.error("Could not load orders:", error);
        setOrders([]);
      }

      setLoaded(true);
    }

    function loadDishes() {
      setMenuDishes(readBrowserDishes(initialDishesRef.current));
    }

    loadOrders();
    loadDishes();

    window.addEventListener("storage", loadOrders);
    window.addEventListener("storage", loadDishes);
    window.addEventListener(DISHES_UPDATED_EVENT, loadDishes);

    return () => {
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener("storage", loadDishes);
      window.removeEventListener(DISHES_UPDATED_EVENT, loadDishes);
    };
  }, [username]);

  function handleCancel(orderId) {
    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status: "Cancelled" }
        : order,
    );

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      const allOrders = Array.isArray(parsed) ? parsed : [];

      const updatedSavedOrders = allOrders.some(
        (order) => String(order.id) === String(orderId),
      )
        ? allOrders.map((order) =>
            String(order.id) === String(orderId)
              ? { ...order, status: "Cancelled" }
              : order,
          )
        : updatedOrders;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSavedOrders),
      );

      setOrders(updatedOrders);
      window.dispatchEvent(new Event("addis-eats-orders-updated"));
    } catch (error) {
      console.error("Could not save cancellation:", error);
    }
  }

  function handleReorder(order) {
    const currentDishes = readBrowserDishes(initialDishesRef.current);
    let addedQuantity = 0;
    const unavailable = [];

    for (const item of order.items || []) {
      const dish = currentDishes.find(
        (currentDish) =>
          String(currentDish.id) === String(item.id) ||
          (
            currentDish.name?.toLowerCase() ===
            item.name?.toLowerCase()
          ),
      );

      if (!dish || dish.enabled === false) {
        unavailable.push(item.name || "An unavailable dish");
        continue;
      }

      const requestedQuantity = Math.max(
        1,
        Math.min(50, Math.trunc(Number(item.quantity) || 1)),
      );

      // Add through the existing cart logic, using the current dish price.
      for (let count = 0; count < requestedQuantity; count++) {
        addToCart(dish);
        addedQuantity++;
      }
    }

    let message = "";

    if (addedQuantity > 0) {
      message = `${addedQuantity} item${addedQuantity === 1 ? "" : "s"} added to your cart using current prices.`;
    }

    if (unavailable.length > 0) {
      message += `${message ? " " : ""}Unavailable dishes skipped: ${unavailable.join(", ")}.`;
    }

    if (addedQuantity === 0 && unavailable.length === 0) {
      message = "This order has no items to reorder.";
    }

    setReorderMessages((current) => ({
      ...current,
      [order.id]: message,
    }));
  }

  if (!loaded) {
    return (
      <p className="py-8 text-center text-[#666666]">
        Loading your orders...
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E8DDD8] bg-white px-6 py-16 text-center shadow-sm">
        <div className="mb-5 text-6xl">📦</div>

        <h2
          className="mb-3 text-3xl font-bold text-[#2F2F2F]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          No Orders Yet
        </h2>

        <p className="mb-7 text-[#666666]">
          Your orders will appear here after you place an order.
        </p>

        <Link
          href="/menu"
          className="inline-block rounded-xl bg-[#7A263A] px-7 py-3.5 font-bold text-white transition hover:bg-[#A64B5D]"
        >
          Explore Menu →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-[#666666]">
        {orders.length} {orders.length === 1 ? "order" : "orders"} saved in this browser.
      </div>

      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 border-b border-[#E8DDD8] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#777777]">
                Order #{order.id}
              </p>

              <p className="mt-1 text-sm text-[#666666]">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Date unavailable"}
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#F1E2E5] px-4 py-2 text-sm font-bold text-[#7A263A]">
              {order.status}
            </span>
          </div>

          <div className="mb-6 grid gap-4 border-b border-[#E8DDD8] pb-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#777777]">Customer</p>
              <p className="mt-1 font-bold text-[#2F2F2F]">{order.name}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#777777]">Phone</p>
              <p className="mt-1 font-bold text-[#2F2F2F]">{order.phone}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm font-semibold text-[#777777]">
                Delivery Address
              </p>
              <p className="mt-1 font-bold text-[#2F2F2F]">{order.address}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2
              className="mb-4 text-xl font-bold text-[#2F2F2F]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Items
            </h2>

            <div className="space-y-3">
              {(order.items || []).map((item, index) => (
                <div
                  key={`${order.id}-${item.id ?? index}`}
                  className="flex items-center justify-between gap-4 rounded-xl bg-[#F8F4EC] px-4 py-3"
                >
                  <div>
                    <p className="font-bold text-[#2F2F2F]">{item.name}</p>
                    <p className="text-sm text-[#777777]">
                      {item.quantity} × {item.price} ETB
                    </p>
                  </div>

                  <p className="font-bold text-[#7A263A]">
                    {item.price * item.quantity} ETB
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E8DDD8] pt-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Subtotal</span>
                <span className="font-semibold text-[#2F2F2F]">
                  {order.subtotal} ETB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Delivery Fee</span>
                <span className="font-semibold text-[#2F2F2F]">
                  {order.deliveryFee} ETB
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#E8DDD8] pt-3">
                <span className="text-lg font-bold text-[#2F2F2F]">Total</span>
                <span className="text-2xl font-bold text-[#7A263A]">
                  {order.total} ETB
                </span>
              </div>
            </div>
          </div>

          {reorderMessages[order.id] && (
            <p
              role="status"
              className="mt-4 rounded-xl bg-[#EEF4EE] px-4 py-3 text-sm text-[#32653A]"
            >
              {reorderMessages[order.id]}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleReorder(order)}
              className="rounded-lg bg-[#7A263A] px-4 py-2 font-bold text-white transition hover:bg-[#A64B5D]"
            >
              Reorder
            </button>

            {order.status !== "Cancelled" && (
              <button
                type="button"
                onClick={() => handleCancel(order.id)}
                className="rounded-lg border border-[#A23B3B] px-4 py-2 text-sm font-bold text-[#A23B3B] transition hover:bg-[#A23B3B] hover:text-white"
              >
                Cancel Order
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default LiveOrders;
