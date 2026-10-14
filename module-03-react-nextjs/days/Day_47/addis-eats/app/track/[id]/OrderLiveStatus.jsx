"use client";

import { useEffect, useState } from "react";
import { when, formatRelativeTime } from "@/lib/format";

const terminalStatuses = ["delivered", "cancelled"];
const RECONNECT_TIMEOUT = 10000;

export default function OrderLiveStatus({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus || "Unknown");
  const [connection, setConnection] = useState("connecting");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    let source;
    let retryTimer;
    let stopped = false;

    function stopStream(nextConnection) {
      stopped = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }

      if (source) {
        source.close();
      }

      setConnection(nextConnection);
    }

    setStatus(initialStatus || "Unknown");
    setConnection("connecting");
    setUpdatedAt(null);

    if (
      terminalStatuses.includes(
        String(initialStatus).toLowerCase()
      )
    ) {
      setConnection("closed");
      return;
    }

    try {
      source = new EventSource(
        `/api/orders/${encodeURIComponent(orderId)}/stream`
      );
    } catch {
      setConnection("unavailable");
      return;
    }

    source.onopen = () => {
      if (stopped) return;

      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }

      setConnection("live");
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
        setUpdatedAt(
          payload.updatedAt || new Date().toISOString()
        );

        if (
          terminalStatuses.includes(
            String(payload.status).toLowerCase()
          )
        ) {
          stopStream("closed");
          return;
        }

        if (retryTimer) {
          clearTimeout(retryTimer);
          retryTimer = null;
        }

        setConnection("live");
      } catch {
        // Ignore malformed messages.
      }
    };

    source.onerror = () => {
      if (stopped) return;

      setConnection("reconnecting");

      // EventSource retries automatically.
      // Stop retrying if the stream remains unavailable.
      if (!retryTimer) {
        retryTimer = setTimeout(() => {
          if (stopped) return;
          stopStream("unavailable");
        }, RECONNECT_TIMEOUT);
      }
    };

    return () => {
      stopped = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
      }

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

      {connection === "unavailable" && (
        <p className="mt-2 text-sm text-[#666666]">
          Showing the last known order status. Automatic live
          updates could not connect. Refresh or revisit this
          page later to try again.
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
