"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function OrdersChart({ data }) {
  return (
    <section className="rounded-2xl border border-[#E8DDD8] bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-[#2F2F2F]">
        Orders Over Time
      </h2>
      <p className="mt-1 text-sm text-[#666666]">
        Orders per day · Last 7 calendar days
      </p>

      <div className="mt-5 h-80 w-full" aria-label="Daily orders line chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 18, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              allowDecimals={false}
              width={40}
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value) => [Number(value) || 0, "Orders"]}
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#7A263A"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="mb-3 text-left font-semibold text-[#666666]">
            Daily orders chart data
          </caption>
          <thead className="border-b border-[#E8DDD8] text-left">
            <tr>
              <th scope="col" className="py-3">Date</th>
              <th scope="col" className="py-3 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.date} className="border-b border-[#F0E9E3]">
                <td className="py-3">{row.day}</td>
                <td className="py-3 text-right font-semibold tabular-nums">
                  {row.orders}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}