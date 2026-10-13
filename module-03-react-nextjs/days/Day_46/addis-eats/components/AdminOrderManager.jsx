
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "addis-eats-orders";
const UPDATED_EVENT = "addis-eats-orders-updated";

const ORDER_STATUSES = [
  "Preparing",
  "Confirmed",
  "Cooking",
  "Ready",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function AdminOrderManager() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function loadOrders() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        if (!Array.isArray(parsed)) {
          throw new Error("The saved order list is invalid.");
        }

        setOrders(parsed);
        setError("");
      } catch {
        setError("Orders could not be loaded from this browser.");
        setOrders([]);
      }

      setLoaded(true);
    }

    loadOrders();

    window.addEventListener("storage", loadOrders);
    window.addEventListener(UPDATED_EVENT, loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener(UPDATED_EVENT, loadOrders);
    };
  }, []);

  function updateStatus(orderId, nextStatus) {
    if (!ORDER_STATUSES.includes(nextStatus)) return;

    const previousOrders = orders;

    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? { ...order, status: nextStatus }
        : order
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedOrders)
      );

      setOrders(updatedOrders);
      setError("");

      window.dispatchEvent(new Event(UPDATED_EVENT));
    } catch {
      setOrders(previousOrders);
      setError("The status could not be saved in this browser.");
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filter === "All" || order.status === filter;

    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      String(order.id).toLowerCase().includes(searchText) ||
      String(order.name || "").toLowerCase().includes(searchText) ||
      String(order.customerId || "").toLowerCase().includes(searchText) ||
      String(order.phone || "").toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  if (!loaded) {
    return (
      <p className="py-8 text-center text-[#666666]">
        Loading orders...
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2F2F2F]">
          Manage Orders
        </h2>
        <p className="mt-1 text-sm text-[#666666]">
          Review orders and update their status.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5">
          <p className="text-sm text-[#666666]">Total orders</p>
          <p className="mt-2 text-3xl font-bold text-[#7A263A]">
            {orders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5">
          <p className="text-sm text-[#666666]">Active orders</p>
          <p className="mt-2 text-3xl font-bold text-[#7A263A]">
            {orders.filter(
              (order) =>
                !["Delivered", "Cancelled"].includes(order.status)
            ).length}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="order-search"
            className="mb-2 block text-sm font-semibold text-[#2F2F2F]"
          >
            Search orders
          </label>
          <input
            id="order-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Order ID, customer, or phone"
            className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3 outline-none focus:border-[#7A263A]"
          />
        </div>

        <div>
          <label
            htmlFor="order-status-filter"
            className="mb-2 block text-sm font-semibold text-[#2F2F2F]"
          >
            Filter by status
          </label>
          <select
            id="order-status-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-full rounded-xl border border-[#D8C9C5] bg-white px-4 py-3 outline-none focus:border-[#7A263A]"
          >
            <option value="All">All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-[#E8DDD8] bg-white px-6 py-12 text-center">
          <div className="mb-3 text-4xl" aria-hidden="true">
            📦
          </div>
          <h3 className="text-xl font-bold text-[#2F2F2F]">
            {orders.length === 0
              ? "No orders yet"
              : "No matching orders"}
          </h3>
          <p className="mt-2 text-sm text-[#666666]">
            {orders.length === 0
              ? "Orders placed through checkout will appear here in this browser."
              : "Try another search or status filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-[#E8DDD8] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#777777]">
                    Order #{order.id}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#2F2F2F]">
                    {order.name || order.customerId || "Customer"}
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">
                    {order.phone || "No phone provided"}
                  </p>
                  <p className="mt-1 text-sm text-[#666666]">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xl font-bold text-[#7A263A]">
                    {formatETB(order.total)}
                  </p>
                  <label
                    htmlFor={`status-${order.id}`}
                    className="mt-3 block text-left text-sm font-semibold text-[#2F2F2F] sm:text-right"
                  >
                    Order status
                  </label>
                  <select
                    id={`status-${order.id}`}
                    value={
                      ORDER_STATUSES.includes(order.status)
                        ? order.status
                        : "Preparing"
                    }
                    onChange={(event) =>
                      updateStatus(order.id, event.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-[#D8C9C5] bg-white px-3 py-2 text-sm sm:w-auto"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {order.address && (
                <p className="mt-4 text-sm text-[#666666]">
                  <span className="font-semibold text-[#2F2F2F]">
                    Delivery:
                  </span>{" "}
                  {order.address}
                </p>
              )}

              <div className="mt-4 border-t border-[#E8DDD8] pt-4">
                <h4 className="mb-2 font-semibold text-[#2F2F2F]">
                  Items
                </h4>

                {Array.isArray(order.items) && order.items.length > 0 ? (
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={`${order.id}-${item.id ?? index}`}
                        className="flex justify-between gap-3 text-sm text-[#666666]"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold text-[#2F2F2F]">
                          {formatETB(
                            Number(item.price) * Number(item.quantity)
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#666666]">
                    No item details available.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
