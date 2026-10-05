"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

function OrderStatus({ order }) {
  const { data, error, isValidating } = useSWR(
    `/api/orders/${order.id}`,
    fetcher,
    {
      fallbackData: order,
      refreshInterval: 5000,
    }
  );

  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">
          Failed to update order status.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#E5D8C7] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#7A263A]">
          Order #{data.id}
        </h2>

        {isValidating && (
          <span className="text-sm font-semibold text-[#666666]">
            Updating...
          </span>
        )}
      </div>

      <p className="mb-2">
        <strong>Status:</strong> {data.status}
      </p>

      <p>
        <strong>Total:</strong> {data.total} ETB
      </p>

      <p className="mt-4 text-sm text-[#666666]">
        Status updates automatically every 5 seconds.
      </p>
    </section>
  );
}

export default OrderStatus;