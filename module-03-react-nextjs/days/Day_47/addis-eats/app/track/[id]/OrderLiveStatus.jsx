"use client";

import { useEffect, useState } from "react";
import { when, formatRelativeTime } from "@/lib/format";

const TERMINAL_STATUSES = ["delivered", "cancelled"];
const RECONNECT_TIMEOUT = 10000;

export default function OrderLiveStatus({
  orderId,
  initialStatus,
}) {
  const [status, setStatus] = useState(initialStatus || "Preparing");
  const [connection, setConnection] = useState("connecting");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [demoStream, setDemoStream] = useState(false);

  useEffect(() => {
    let source;
    let retryTimer;
    let stopped = false;

    function stopStream(nextConnection) {
      if (stopped) return;

      stopped = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }

      source?.close();
      setConnection(nextConnection);
    }

    setStatus(initialStatus || "Preparing");
    setConnection("connecting");
    setUpdatedAt(null);
    setDemoStream(false);

    if (
      TERMINAL_STATUSES.includes(
        String(initialStatus).toLowerCase(),
      )
    ) {
      setConnection("closed");
      return;
    }

    const seed = encodeURIComponent(initialStatus || "Preparing");

    // Explicitly request the server-seeded fallback stream.
    const url =
      `/api/orders/${encodeURIComponent(orderId)}/stream` +
      `?demo=1&seed=${seed}`;

    source = new EventSource(url);

    source.onopen = () => {
      if (stopped) return;

      setConnection("live");

      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
    };

    source.onmessage = (event) => {
      if (stopped) return;

      try {
        const payload = JSON.parse(event.data);

        if (payload.error) {
          stopStream("unavailable");
          return;
        }

        if (!payload.status) return;

        setStatus(payload.status);
        setDemoStream(Boolean(payload.demo));
        setUpdatedAt(
          payload.updatedAt || new Date().toISOString(),
        );

        if (
          TERMINAL_STATUSES.includes(
            String(payload.status).toLowerCase(),
          )
        ) {
          stopStream("closed");
          return;
        }

        setConnection("live");

        if (retryTimer) {
          clearTimeout(retryTimer);
          retryTimer = null;
        }
      } catch {
        // Ignore malformed stream messages.
      }
    };

    source.onerror = () => {
      if (stopped) return;

      setConnection("reconnecting");

      if (!retryTimer) {
        retryTimer = setTimeout(() => {
          stopStream("unavailable");
        }, RECONNECT_TIMEOUT);
      }
    };

    return () => {
      stopped = true;

      if (retryTimer) clearTimeout(retryTimer);
      source?.close();
    };
  }, [orderId, initialStatus]);

  let connectionLabel = "Connecting to live updates…";

  if (connection === "live") {
    connectionLabel = "Live updates connected";
  } else if (connection === "reconnecting") {
    connectionLabel = "Reconnecting…";
  } else if (connection === "unavailable") {
    connectionLabel = "Live updates unavailable";
  } else if (connection === "closed") {
    connectionLabel = "No further updates needed";
  }

  return (
    <div className="mt-4 rounded-xl bg-[#F8F4EC] p-4">
      <p className="text-sm text-[#666666]">Current status</p>

      <p className="mt-1 text-xl font-bold text-[#7A263A]">
        {status}
      </p>

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

      {demoStream && connection === "live" && (
        <p className="mt-2 text-sm text-[#666666]">
          Server-seeded SSE demonstration. Statuses are simulated
          because this order is not stored in the current server
          instance.
        </p>
      )}

      {connection === "unavailable" && (
        <p className="mt-2 text-sm text-[#666666]">
          Automatic updates are unavailable. The last known status
          remains visible.
        </p>
      )}

      {updatedAt && (
        <p className="mt-2 text-sm text-[#666666]">
          Updated {formatRelativeTime(updatedAt)} ·{" "}
          {when.format(new Date(updatedAt))}
        </p>
      )}
    </div>
  );
}
