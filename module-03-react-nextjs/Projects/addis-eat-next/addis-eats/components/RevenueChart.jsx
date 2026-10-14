"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function RevenueChart({ data }) {
  return (
    <section className="rounded-2xl border border-[#E8DDD8] bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-[#2F2F2F]">
        Revenue by Neighbourhood
      </h2>
      <p className="mt-1 text-sm text-[#666666]">
        Revenue from non-cancelled orders · ETB
      </p>

      {data.length === 0 ? (
        <p className="mt-6 rounded-xl bg-[#F8F4EC] p-5 text-sm text-[#666666]">
          No revenue data yet. Place a test order to populate this chart.
        </p>
      ) : (
        <>
          <div className="mt-5 h-80 w-full" aria-label="Revenue bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 12, bottom: 30, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="area"
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={65}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  width={105}
                  domain={[0, "auto"]}
                  tickFormatter={(value) => formatETB(value)}
                />
                <Tooltip
                  formatter={(value) => [
                    formatETB(Number(value)),
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#7A263A"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="mb-3 text-left font-semibold text-[#666666]">
                Revenue chart data
              </caption>
              <thead className="border-b border-[#E8DDD8] text-left">
                <tr>
                  <th scope="col" className="py-3 pr-4">Neighbourhood</th>
                  <th scope="col" className="py-3 text-right">Revenue (ETB)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.area} className="border-b border-[#F0E9E3]">
                    <td className="py-3 pr-4">{row.area}</td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {formatETB(row.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}