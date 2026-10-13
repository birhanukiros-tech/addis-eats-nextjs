
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDishes } from "@/lib/dishes";
import AdminSidebar from "@/components/AdminSidebar";
import AdminDishManager from "@/components/AdminDishManager";
import AdminOrderManager from "@/components/AdminOrderManager";
import AdminDashboardData from "@/components/AdminDashboardData";

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

const validSorts = ["date", "customer", "total", "status"];

export default async function KitchenPage({ searchParams }) {
  // Protect the admin area.
  const session = await getSession();

  if (!session) {
    redirect("/login?next=%2Fkitchen");
  }

  if (session.role !== "staff") {
    redirect("/orders");
  }

  // Read the selected sidebar section and table settings from the URL.
  const params = await searchParams;
  const requestedView = params?.view;

  const activeView = Object.hasOwn(views, requestedView)
    ? requestedView
    : "dashboard";

  const currentView = views[activeView];

  const requestedSort = params?.sort;
  const sort = validSorts.includes(requestedSort)
    ? requestedSort
    : "date";

  const dir = params?.dir === "asc" ? "asc" : "desc";

  const requestedPage = Number(params?.page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  // Manage Dishes.
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

  // Manage Orders.
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

  // Dashboard reads the same browser order data as Manage Orders.
  return (
    <AdminLayout
      session={session}
      activeView={activeView}
      currentView={currentView}
    >
      <AdminDashboardData
        page={page}
        sort={sort}
        dir={dir}
      />
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
