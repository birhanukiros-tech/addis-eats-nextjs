import { getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_STATUSES = [
  "Preparing",
  "Confirmed",
  "Cooking",
  "Ready",
  "Out for delivery",
  "Delivered",
];

const ALLOWED_STATUSES = [...DEMO_STATUSES, "Cancelled"];

function createSseResponse(request, id, seed, isDemo) {
  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let closed = false;
      let timer = null;
      let heartbeat = null;

      function closeStream() {
        if (closed) return;

        closed = true;
        clearInterval(timer);
        clearInterval(heartbeat);
        request.signal.removeEventListener("abort", closeStream);

        try {
          controller.close();
        } catch {
          // The connection may already be closed.
        }
      }

      cleanup = closeStream;

      function send(payload) {
        if (closed) return;

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
          );
        } catch {
          closeStream();
        }
      }

      request.signal.addEventListener(
        "abort",
        closeStream,
        { once: true },
      );

      if (isDemo) {
        let index = DEMO_STATUSES.indexOf(seed);

        if (seed === "Cancelled") {
          send({
            id,
            status: "Cancelled",
            updatedAt: new Date().toISOString(),
            demo: true,
          });
          closeStream();
          return;
        }

        if (index < 0) index = 0;

        function publish() {
          const status = DEMO_STATUSES[index];

          send({
            id,
            status,
            updatedAt: new Date().toISOString(),
            demo: true,
          });

          if (status === "Delivered") {
            closeStream();
          }
        }

        // Send the server-seeded status immediately.
        publish();

        if (!closed) {
          timer = setInterval(() => {
            if (index < DEMO_STATUSES.length - 1) {
              index += 1;
            }

            publish();
          }, 1500);
        }
      } else {
        let lastStatus = null;

        function publishActualStatus() {
          const order = getOrder(id);

          if (!order) {
            send({
              id,
              error: "Order is unavailable on this server instance.",
            });
            closeStream();
            return;
          }

          if (order.status !== lastStatus) {
            lastStatus = order.status;

            send({
              id: order.id,
              status: order.status,
              updatedAt: order.updatedAt || null,
              demo: false,
            });
          }

          if (
            ["Delivered", "Cancelled"].includes(order.status)
          ) {
            closeStream();
          }
        }

        publishActualStatus();

        if (!closed) {
          timer = setInterval(publishActualStatus, 3000);
          heartbeat = setInterval(() => {
            if (closed) return;

            try {
              controller.enqueue(encoder.encode(": keep-alive\n\n"));
            } catch {
              closeStream();
            }
          }, 10000);
        }
      }
    },

    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { error: "Sign in required." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const url = new URL(request.url);
  const order = getOrder(id);

  // Never let demo mode bypass ownership of a real order.
  if (
    order &&
    session.role !== "staff" &&
    String(order.customerId).toLowerCase() !==
      String(session.username).toLowerCase()
  ) {
    return Response.json(
      { error: "Order not found." },
      { status: 404 },
    );
  }

  const demoRequested = url.searchParams.get("demo") === "1";

  // Vercel requests are independent of other server instances'
  // in-memory Maps. Use the server-seeded demo there.
  const useDemo =
    demoRequested &&
    (process.env.VERCEL === "1" || !order);

  if (useDemo) {
    const requestedSeed = url.searchParams.get("seed");
    const seed = ALLOWED_STATUSES.includes(requestedSeed)
      ? requestedSeed
      : order?.status || "Preparing";

    return createSseResponse(request, String(id), seed, true);
  }

  if (!order) {
    return Response.json(
      { error: "Order not found." },
      { status: 404 },
    );
  }

  return createSseResponse(
    request,
    String(id),
    order.status,
    false,
  );
}
