
"use client";

import { useEffect, useMemo, useState } from "react";
import RevenueChart from "@/components/RevenueChart";
import OrdersChart from "@/components/OrdersChart";
import AdminOrdersTable from "@/components/AdminOrdersTable";

const STORAGE_KEY = "addis-eats-orders";
const UPDATED_EVENT = "addis-eats-orders-updated";
const PAGE_SIZE = 20;

function formatETB(value) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getArea(order) {
  const area =
    order.neighbourhood ||
    order.neighborhood ||
    order.area ||
    order.deliveryArea;

  return typeof area === "string" && area.trim()
    ? area.trim()
    : "Area not recorded";
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getRevenueData(orders) {
  const byArea = new Map();

  for (const order of orders) {
    if (String(order.status).toLowerCase() === "cancelled") {
      continue;
    }

    const revenue = Number(order.total);

    if (!Number.isFinite(revenue)) continue;

    const area = getArea(order);
    byArea.set(area, (byArea.get(area) || 0) + revenue);
  }

  return Array.from(byArea, ([area, revenue]) => ({
    area,
    revenue,
  })).sort((a, b) => b.revenue - a.revenue);
}

function getDailyData(orders) {
  const counts = new Map();

  for (const order of orders) {
    if (!order.createdAt) continue;

    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) continue;

    const key = getLocalDateKey(date);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() - (6 - index));

    const key = getLocalDateKey(date);

    return {
      date: key,
      day: new Intl.DateTimeFormat("en-ET", {
        month: "short",
        day: "numeric",
      }).format(date),
      orders: counts.get(key) || 0,
    };
  });
}

export default function AdminDashboardData({
  page = 1,
  sort = "date",
  dir = "desc",
}) {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function loadOrders() {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        if (!Array.isArray(parsed)) {
          throw new Error("The saved order list is invalid.");
        }

        setOrders(parsed);
        setError("");
      } catch {
        setError("Orders could not be loaded from this browser.");
      } finally {
        setLoaded(true);
      }
    }

    loadOrders();

    window.addEventListener("storage", loadOrders);
    window.addEventListener(UPDATED_EVENT, loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener(UPDATED_EVENT, loadOrders);
    };
  }, []);

  const summary = useMemo(() => {
    const revenueOrders = orders.filter(
      (order) => String(order.status).toLowerCase() !== "cancelled"
    );

    const revenue = revenueOrders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0
    );

    const activeOrders = orders.filter(
      (order) =>
        !["delivered", "cancelled"].includes(
          String(order.status).toLowerCase()
        )
    ).length;

    return {
      revenue,
      activeOrders,
      revenueData: getRevenueData(orders),
      dailyData: getDailyData(orders),
    };
  }, [orders]);

  const sortedOrders = useMemo(() => {
    const result = [...orders];

    result.sort((a, b) => {
      let comparison = 0;

      if (sort === "total") {
        comparison = (Number(a.total) || 0) - (Number(b.total) || 0);
      } else if (sort === "status") {
        comparison = String(a.status || "").localeCompare(
          String(b.status || "")
        );
      } else if (sort === "customer") {
        comparison = String(a.name || a.customerId || "").localeCompare(
          String(b.name || b.customerId || "")
        );
      } else {
        comparison =
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime();
      }

      return dir === "asc" ? comparison : -comparison;
    });

    return result;
  }, [orders, sort, dir]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / PAGE_SIZE)
  );

  const safePage = Math.min(Math.max(1, page), totalPages);

  const pageOrders = sortedOrders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (!loaded) {
    return (
      <section aria-busy="true" className="animate-pulse space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-24 rounded-2xl bg-[#F1E2E5]" />
          <div className="h-24 rounded-2xl bg-[#F1E2E5]" />
          <div className="h-24 rounded-2xl bg-[#F1E2E5]" />
        </div>
        <div className="h-80 rounded-2xl bg-[#F1E2E5]" />
        <div className="h-64 rounded-2xl bg-[#F1E2E5]" />
        <p className="text-sm text-[#666666]">Loading dashboard data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6"
      >
        <h2 className="text-xl font-bold text-red-800">
          Dashboard data could not load
        </h2>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5">
          <p className="text-sm text-[#666666]">Total orders</p>
          <p className="mt-2 text-3xl font-bold text-[#7A263A]">
            {orders.length}
          </p>
        </article>

        <article className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5">
          <p className="text-sm text-[#666666]">Active orders</p>
          <p className="mt-2 text-3xl font-bold text-[#7A263A]">
            {summary.activeOrders}
          </p>
        </article>

        <article className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-[#666666]">
            Revenue excluding cancelled orders
          </p>
          <p className="mt-2 text-3xl font-bold text-[#7A263A]">
            {formatETB(summary.revenue)}
          </p>
        </article>
      </div>

      {orders.length === 0 && (
        <div className="rounded-2xl border border-[#E8DDD8] bg-white p-5">
          <h2 className="font-bold text-[#2F2F2F]">No orders yet</h2>
          <p className="mt-1 text-sm text-[#666666]">
            Orders placed through checkout in this browser will appear here.
          </p>
        </div>
      )}

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <RevenueChart data={summary.revenueData} />
        <OrdersChart data={summary.dailyData} />
      </div>

      <AdminOrdersTable
        orders={pageOrders}
        page={safePage}
        totalPages={totalPages}
        total={orders.length}
        sort={sort}
        dir={dir}
      />
    </section>
  );
}
