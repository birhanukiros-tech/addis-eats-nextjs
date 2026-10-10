
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersFor } from "@/lib/orders";
import LiveOrders from "@/components/LiveOrders";

export const metadata = {
  title: "Orders",
  description: "View your previous orders and order history.",
};

async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/orders");
  }

  const orders = getOrdersFor(session.username);

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#E8DDD8] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-5 text-6xl">📦</div>

          <h1
            className="mb-3 text-3xl font-bold text-[#2F2F2F]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            No Orders Yet
          </h1>

          <p className="mb-7 text-[#666666]">
            Your completed orders will appear here.
          </p>

          <Link
            href="/menu"
            className="inline-block rounded-xl bg-[#7A263A] px-7 py-3.5 font-bold text-white transition hover:bg-[#A64B5D]"
          >
            Explore Menu →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 rounded-3xl bg-[#7A263A] px-6 py-10 text-center shadow-lg sm:px-10">
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
            ADDIS EATS
          </p>

          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            My Orders
          </h1>

          <p className="mt-3 text-[#F1E2E5]">
            View your order history
          </p>
        </div>

        {/* Live order list */}
        <LiveOrders initialOrders={orders} />
      </div>
    </main>
  );
}

export default OrdersPage;