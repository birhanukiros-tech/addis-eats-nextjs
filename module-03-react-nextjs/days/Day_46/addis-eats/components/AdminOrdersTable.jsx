import Link from "next/link";

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function dashboardHref(page, sort, dir) {
  const params = new URLSearchParams({
    view: "dashboard",
    page: String(page),
    sort,
    dir,
  });

  return `/kitchen?${params.toString()}`;
}

export default function AdminOrdersTable({
  orders,
  page,
  totalPages,
  total,
  sort,
  dir,
}) {
  const columns = [
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    { key: "total", label: "Total (ETB)" },
    { key: "status", label: "Status" },
  ];

  function renderSortHeader(column) {
    const active = sort === column.key;
    const nextDir = active && dir === "asc" ? "desc" : "asc";

    const ariaSort = active
      ? dir === "asc"
        ? "ascending"
        : "descending"
      : "none";

    return (
      <th
        key={column.key}
        scope="col"
        aria-sort={ariaSort}
        className={`px-4 py-3 ${
          column.key === "total" ? "text-right" : "text-left"
        }`}
      >
        <Link
          href={dashboardHref(1, column.key, nextDir)}
          className="inline-flex items-center gap-1 hover:text-[#7A263A]"
        >
          {column.label}
          <span aria-hidden="true">
            {active ? (dir === "asc" ? "↑" : "↓") : "↕"}
          </span>
        </Link>
      </th>
    );
  }

  return (
    <section className="rounded-2xl border border-[#E8DDD8] bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#2F2F2F]">Recent Orders</h2>
        <p className="mt-1 text-sm text-[#666666]">
          Sortable order history · 20 orders per page
        </p>
      </div>

      {total === 0 ? (
        <div className="rounded-xl bg-[#F8F4EC] p-6 text-center">
          <h3 className="font-bold text-[#2F2F2F]">No orders yet</h3>
          <p className="mt-2 text-sm text-[#666666]">
            Place a test order through customer checkout to populate the dashboard.
          </p>
          <Link
            href="/menu"
            className="mt-4 inline-block font-bold text-[#7A263A] hover:underline"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-sm">
              <caption className="sr-only">
                Recent Addis Eats orders. Select column headings to sort.
              </caption>
              <thead className="border-b border-[#E8DDD8] bg-[#FCFAF6] text-[#2F2F2F]">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    Order ID
                  </th>
                  {columns.map(renderSortHeader)}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#F0E9E3] hover:bg-[#FCFAF6]"
                  >
                    <td className="px-4 py-4 font-semibold">
                      #{order.id}
                    </td>
                    <td className="px-4 py-4">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      {order.name || order.customerId || "Customer"}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold tabular-nums">
                      {formatETB(order.total)}
                    </td>
                    <td className="px-4 py-4">
                      {order.status || "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav
            aria-label="Order table pagination"
            className="mt-5 flex flex-wrap items-center justify-between gap-3"
          >
            <p className="text-sm text-[#666666]">
              Page {page} of {totalPages} · {total} orders
            </p>

            <div className="flex items-center gap-2">
              <Link
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                href={dashboardHref(Math.max(1, page - 1), sort, dir)}
                className={`rounded-lg border px-4 py-2 font-semibold ${
                  page <= 1
                    ? "pointer-events-none border-[#E8DDD8] text-gray-400"
                    : "border-[#7A263A] text-[#7A263A] hover:bg-[#F1E2E5]"
                }`}
              >
                Previous
              </Link>

              <Link
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : undefined}
                href={dashboardHref(
                  Math.min(totalPages, page + 1),
                  sort,
                  dir
                )}
                className={`rounded-lg border px-4 py-2 font-semibold ${
                  page >= totalPages
                    ? "pointer-events-none border-[#E8DDD8] text-gray-400"
                    : "border-[#7A263A] text-[#7A263A] hover:bg-[#F1E2E5]"
                }`}
              >
                Next
              </Link>
            </div>
          </nav>
        </>
      )}
    </section>
  );
}