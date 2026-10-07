import Link from "next/link";
import CancelOrderButton from "@/components/CancelOrderButton";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersFor } from "@/lib/orders";

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

          <p className="mt-3 text-[#F1E2E5]">View your order history</p>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm sm:p-8"
            >
              {/* Order top */}
              <div className="mb-6 flex flex-col gap-4 border-b border-[#E8DDD8] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#777777]">
                    Order #{order.id}
                  </p>

                  <p className="mt-1 text-sm text-[#666666]">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-[#F1E2E5] px-4 py-2 text-sm font-bold text-[#7A263A]">
                  {order.status}
                </span>
              </div>

              {/* Customer */}
              <div className="mb-6 grid gap-4 border-b border-[#E8DDD8] pb-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-[#777777]">
                    Customer
                  </p>

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

                  <p className="mt-1 font-bold text-[#2F2F2F]">
                    {order.address}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h2
                  className="mb-4 text-xl font-bold text-[#2F2F2F]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Items
                </h2>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
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

              {/* Order Summary */}
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
                    <span className="text-lg font-bold text-[#2F2F2F]">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#7A263A]">
                      {order.total} ETB
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancel Order */}
              {order.status !== "Cancelled" && (
                <CancelOrderButton orderId={order.id} />
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default OrdersPage;
