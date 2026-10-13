
"use client";

import { useEffect, useState } from "react";
import { when, formatRelativeTime } from "@/lib/format";

const terminalStatuses = ["delivered", "cancelled"];

export default function OrderLiveStatus({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus || "Unknown");
  const [connection, setConnection] = useState("connecting");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    setStatus(initialStatus || "Unknown");
    setConnection("connecting");
    setUpdatedAt(null);

    if (terminalStatuses.includes(String(initialStatus).toLowerCase())) {
      setConnection("closed");
      return;
    }

    const source = new EventSource(
      `/api/orders/${encodeURIComponent(orderId)}/stream`
    );

    source.onopen = () => {
      setConnection("live");
    };

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.error) {
          source.close();
          setConnection("closed");
          return;
        }

        if (payload.status) {
          setStatus(payload.status);
          setUpdatedAt(payload.updatedAt || new Date().toISOString());

          if (
            terminalStatuses.includes(String(payload.status).toLowerCase())
          ) {
            source.close();
            setConnection("closed");
          } else {
            setConnection("live");
          }
        }
      } catch {
        // Ignore malformed messages and keep the connection available.
      }
    };

    // EventSource retries automatically; keep the UI honest about that.
    source.onerror = () => {
      setConnection("reconnecting");
    };

    return () => {
      source.close();
    };
  }, [orderId, initialStatus]);

  let connectionLabel = "Connecting…";

  if (connection === "live") connectionLabel = "Live updates connected";
  if (connection === "reconnecting") connectionLabel = "Reconnecting…";
  if (connection === "closed") connectionLabel = "Live updates finished";

  return (
    <div className="mt-4 rounded-xl bg-[#F8F4EC] p-4">
      <p className="text-sm text-[#666666]">Current status</p>
      <p className="mt-1 text-xl font-bold text-[#7A263A]">{status}</p>

      <p
        role="status"
        className="mt-3 flex items-center gap-2 text-sm text-[#666666]"
      >
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full ${
            connection === "live"
              ? "bg-green-600"
              : connection === "reconnecting"
                ? "bg-amber-500"
                : "bg-[#A64B5D]"
          }`}
        />
        {connectionLabel}
      </p>

      {updatedAt && (
        <p className="mt-2 text-sm text-[#666666]">
          Updated {formatRelativeTime(updatedAt)} ·{" "}
          {when.format(new Date(updatedAt))}
        </p>
      )}
    </div>
  );
}
