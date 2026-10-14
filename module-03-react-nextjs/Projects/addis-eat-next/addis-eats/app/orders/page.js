
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LiveOrders from "@/components/LiveOrders";

export const metadata = {
  title: "Orders",
  description: "View your previous orders and order history.",
};

export default async function OrdersPage() {
  const session = await getSession();

  // Signed-out visitors must sign in first.
  if (!session) {
    redirect("/login?next=%2Forders");
  }

  // Staff must use the Admin area, not the customer Orders page.
  if (session.role === "staff") {
    redirect("/login?next=%2Forders");
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
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

        <LiveOrders username={session.username} initialOrders={[]} />
      </div>
    </main>
  );
}
