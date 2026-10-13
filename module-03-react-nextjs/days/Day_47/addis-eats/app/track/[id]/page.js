
import { notFound, redirect } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { etb, when, formatRelativeTime } from "@/lib/format";
import MapPanel from "./MapPanel";
import OrderLiveStatus from "./OrderLiveStatus";

export const metadata = {
  title: "Track Your Delivery | Addis Eats",
  description: "Track your Addis Eats order and delivery status.",
};

export default async function TrackOrderPage({ params }) {
  const { id } = await params;

  // Require a signed-in customer or staff member.
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(`/track/${id}`)}`);
  }

  // Load the selected order.
  const order = getOrder(id);

  if (!order) {
    notFound();
  }

  // Customers can track only their own orders.
  // Staff can inspect orders from the Admin area.
  if (
    session.role !== "staff" &&
    String(order.customerId).toLowerCase() !==
      String(session.username).toLowerCase()
  ) {
    notFound();
  }

  const placedAt = order.createdAt
    ? new Date(order.createdAt)
    : null;

  const validPlacedAt =
    placedAt && !Number.isNaN(placedAt.getTime());

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page heading */}
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
          {/* Delivery map and readable address */}
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
                The map currently uses demonstration coordinates around
                Bole, Addis Ababa. The address above comes from your order.
                The markers do not represent live GPS tracking.
              </p>
            </div>
          </div>

          {/* Status and order summary */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#2F2F2F]">
                Order Status
              </h2>

              {/* Server-provided initial status, followed by SSE updates */}
              <OrderLiveStatus
                orderId={String(order.id)}
                initialStatus={order.status}
              />

              <div className="mt-5 border-t border-[#E8DDD8] pt-4">
                <p className="text-sm text-[#666666]">
                  Order placed
                </p>

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
                        Number(item.price) * Number(item.quantity)
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
