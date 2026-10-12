
"use client";

import useSWR from "swr";
import CancelOrderButton from "@/components/CancelOrderButton";
import fetcher from "@/lib/fetcher";

function LiveOrders({ initialOrders }) {
  const { data, error, isValidating } = useSWR(
    "/api/orders",
    fetcher,
    {
      fallbackData: { data: initialOrders },
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  const orders = data?.data ?? initialOrders;

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E8DDD8] bg-white px-6 py-12 text-center shadow-sm">
        <div className="mb-5 text-6xl">📦</div>

        <h2
          className="mb-3 text-3xl font-bold text-[#2F2F2F]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          No Orders Yet
        </h2>

        <p className="text-[#666666]">
          Your completed orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[#666666]">
          Order status updates automatically.
        </p>

        <span className="shrink-0 text-xs text-[#777777]">
          {error
            ? "Update failed"
            : isValidating
              ? "Checking..."
              : "Live updates on"}
        </span>
      </div>

      <div className="space-y-6">
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
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#F1E2E5] px-4 py-2 text-sm font-bold text-[#7A263A]">
                {order.status}
              </span>
            </div>

            <div className="mb-6 grid gap-4 border-b border-[#E8DDD8] pb-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-[#777777]">
                  Customer
                </p>
                <p className="mt-1 font-bold text-[#2F2F2F]">
                  {order.name}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#777777]">
                  Phone
                </p>
                <p className="mt-1 font-bold text-[#2F2F2F]">
                  {order.phone}
                </p>
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

            <div className="mb-6">
              <h2
                className="mb-4 text-xl font-bold text-[#2F2F2F]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Items
              </h2>

              <div className="space-y-3">
                {(order.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl bg-[#F8F4EC] px-4 py-3"
                  >
                    <div>
                      <p className="font-bold text-[#2F2F2F]">
                        {item.name}
                      </p>

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
                  <span className="text-lg font-bold text-[#2F2F2F]">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#7A263A]">
                    {order.total} ETB
                  </span>
                </div>
              </div>
            </div>

            {order.status !== "Cancelled" && (
              <CancelOrderButton orderId={order.id} />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default LiveOrders;
