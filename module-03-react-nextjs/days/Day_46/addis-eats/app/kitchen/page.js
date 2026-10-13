import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDishes } from "@/lib/dishes";
import { getAllOrders } from "@/lib/orders";
import AdminSidebar from "@/components/AdminSidebar";
import AdminDishManager from "@/components/AdminDishManager";
import AdminOrderManager from "@/components/AdminOrderManager";
import RevenueChart from "@/components/RevenueChart";
import OrdersChart from "@/components/OrdersChart";
import AdminOrdersTable from "@/components/AdminOrdersTable";

export const metadata = {
  title: "Admin Panel | Addis Eats",
  description: "Manage Addis Eats dishes and orders.",
};

const views = {
  dashboard: {
    title: "Dashboard",
    description: "Monitor restaurant performance and order activity.",
  },
  dishes: {
    title: "Manage Dishes",
    description: "Add, edit, enable, disable, and remove dishes.",
  },
  orders: {
    title: "Manage Orders",
    description: "Review customer orders and manage their status.",
  },
};

const PAGE_SIZE = 20;

const validSorts = ["date", "customer", "total", "status"];

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

function getRevenueData(orders) {
  const byArea = new Map();

  for (const order of orders) {
    if (String(order.status).toLowerCase() === "cancelled") continue;

    const area = getArea(order);
    const amount = Number(order.total);

    if (!Number.isFinite(amount)) continue;

    byArea.set(area, (byArea.get(area) || 0) + amount);
  }

  const rows = Array.from(byArea, ([area, revenue]) => ({
    area,
    revenue,
  })).sort((a, b) => b.revenue - a.revenue);

  if (rows.length <= 7) return rows;

  const topRows = rows.slice(0, 6);
  const otherRevenue = rows
    .slice(6)
    .reduce((sum, row) => sum + row.revenue, 0);

  return [...topRows, { area: "Other", revenue: otherRevenue }];
}

function getOrdersPerDay(orders) {
  const counts = new Map();

  for (const order of orders) {
    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) continue;

    const key = date.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const today = new Date();
  const start = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  const formatter = new Intl.DateTimeFormat("en-ET", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() - (6 - index));

    const key = date.toISOString().slice(0, 10);

    return {
      date: key,
      day: formatter.format(date),
      orders: counts.get(key) || 0,
    };
  });
}

export default async function KitchenPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=%2Fkitchen");
  }

  if (session.role !== "staff") {
    redirect("/orders");
  }

  const params = await searchParams;
  const requestedView = params?.view;

  const activeView = Object.hasOwn(views, requestedView)
    ? requestedView
    : "dashboard";

  const currentView = views[activeView];

  if (activeView === "dishes") {
    const initialDishes = await getDishes();

    return (
      <AdminLayout
        session={session}
        activeView={activeView}
        currentView={currentView}
      >
        <AdminDishManager initialDishes={initialDishes} />
      </AdminLayout>
    );
  }

  if (activeView === "orders") {
    return (
      <AdminLayout
        session={session}
        activeView={activeView}
        currentView={currentView}
      >
        <AdminOrderManager />
      </AdminLayout>
    );
  }

  const allOrders = getAllOrders();

  const nonCancelledOrders = allOrders.filter(
    (order) => String(order.status).toLowerCase() !== "cancelled"
  );

  const revenue = nonCancelledOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );

  const activeOrders = allOrders.filter(
    (order) =>
      !["delivered", "cancelled"].includes(
        String(order.status).toLowerCase()
      )
  ).length;

  const revenueData = getRevenueData(allOrders);
  const dailyData = getOrdersPerDay(allOrders);

  const requestedSort = params?.sort;
  const sort = validSorts.includes(requestedSort)
    ? requestedSort
    : "date";

  const dir = params?.dir === "asc" ? "asc" : "desc";

  const sortedOrders = [...allOrders].sort((a, b) => {
    let result = 0;

    if (sort === "total") {
      result = (Number(a.total) || 0) - (Number(b.total) || 0);
    } else if (sort === "status") {
      result = String(a.status || "").localeCompare(
        String(b.status || "")
      );
    } else if (sort === "customer") {
      result = String(a.name || a.customerId || "").localeCompare(
        String(b.name || b.customerId || "")
      );
    } else {
      result =
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime();
    }

    return dir === "asc" ? result : -result;
  });

  const requestedPage = Number(params?.page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const pageOrders = sortedOrders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const formatETB = (value) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <AdminLayout
      session={session}
      activeView={activeView}
      currentView={currentView}
    >
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5">
            <p className="text-sm text-[#666666]">Total orders</p>
            <p className="mt-2 text-3xl font-bold text-[#7A263A]">
              {allOrders.length}
            </p>
          </article>

          <article className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5">
            <p className="text-sm text-[#666666]">Active orders</p>
            <p className="mt-2 text-3xl font-bold text-[#7A263A]">
              {activeOrders}
            </p>
          </article>

          <article className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5 sm:col-span-2 xl:col-span-1">
            <p className="text-sm text-[#666666]">
              Revenue excluding cancelled orders
            </p>
            <p className="mt-2 text-3xl font-bold text-[#7A263A]">
              {formatETB(revenue)}
            </p>
          </article>
        </div>

        {allOrders.length === 0 && (
          <div className="rounded-2xl border border-[#E8DDD8] bg-white p-5">
            <h2 className="font-bold text-[#2F2F2F]">No orders yet</h2>
            <p className="mt-1 text-sm text-[#666666]">
              The charts show zero orders until a customer places an order.
            </p>
          </div>
        )}

        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <RevenueChart data={revenueData} />
          <OrdersChart data={dailyData} />
        </div>

        <AdminOrdersTable
          orders={pageOrders}
          page={safePage}
          totalPages={totalPages}
          total={allOrders.length}
          sort={sort}
          dir={dir}
        />
      </section>
    </AdminLayout>
  );
}

function AdminLayout({ session, activeView, currentView, children }) {
  return (
    <main className="min-h-screen bg-[#F8F4EC] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row">
        <AdminSidebar activeView={activeView} />

        <section className="min-w-0 flex-1">
          <header className="rounded-3xl bg-[#7A263A] px-6 py-8 shadow-lg sm:px-9 sm:py-10">
            <p className="text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
              ADDIS EATS · STAFF
            </p>

            <h1
              className="mt-3 text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {currentView.title}
            </h1>

            <p className="mt-3 text-[#F1E2E5]">
              Welcome, {session.username}. {currentView.description}
            </p>
          </header>

          <div className="mt-6 min-w-0 rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}