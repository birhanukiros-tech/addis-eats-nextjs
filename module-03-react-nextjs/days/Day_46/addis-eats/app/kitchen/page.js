
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDishes } from "@/lib/dishes";
import AdminSidebar from "@/components/AdminSidebar";
import AdminDishManager from "@/components/AdminDishManager";

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

export default async function KitchenPage({ searchParams }) {
  // 1. Protect the Admin area.
  const session = await getSession();

  if (!session) {
    redirect("/login?next=%2Fkitchen");
  }

  if (session.role !== "staff") {
    redirect("/orders");
  }

  // 2. Read the selected Admin sidebar section from the URL.
  const params = await searchParams;
  const requestedView = params?.view;

  const activeView = Object.hasOwn(views, requestedView)
    ? requestedView
    : "dashboard";

  const currentView = views[activeView];

  // 3. Load the existing dishes only when Manage Dishes is open.
  const initialDishes =
    activeView === "dishes" ? await getDishes() : [];

  // 4. Render the Admin interface.
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

          <div className="mt-6 rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm sm:p-8">
            {activeView === "dashboard" && (
              <section>
                <h2 className="text-2xl font-bold text-[#2F2F2F]">
                  Restaurant Overview
                </h2>

                <p className="mt-2 text-[#666666]">
                  Revenue charts, daily order trends, and the paginated
                  order table will be added here.
                </p>
              </section>
            )}

            {activeView === "dishes" && (
              <AdminDishManager initialDishes={initialDishes} />
            )}

            {activeView === "orders" && (
              <section>
                <h2 className="text-2xl font-bold text-[#2F2F2F]">
                  Order Management
                </h2>

                <p className="mt-2 text-[#666666]">
                  The staff order table and order-status controls
                  will be added here.
                </p>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
