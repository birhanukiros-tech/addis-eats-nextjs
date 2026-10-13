
import { getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;
  const order = getOrder(id);

  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  // Customers may only stream their own orders; staff may stream any order.
  if (
    session.role !== "staff" &&
    String(order.customerId).toLowerCase() !==
      String(session.username).toLowerCase()
  ) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let intervalId;
      let heartbeatId;
      let closed = false;
      let lastStatus;

      function closeStream() {
        if (closed) return;
        closed = true;

        clearInterval(intervalId);
        clearInterval(heartbeatId);
        request.signal.removeEventListener("abort", closeStream);

        try {
          controller.close();
        } catch {
          // The client may already have disconnected.
        }
      }

      function send(data) {
        if (closed) return;

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          closeStream();
        }
      }

      function publishStatus() {
        const latestOrder = getOrder(id);

        if (!latestOrder) {
          send({ id, error: "Order no longer available." });
          closeStream();
          return;
        }

        if (latestOrder.status !== lastStatus) {
          lastStatus = latestOrder.status;

          send({
            id: latestOrder.id,
            status: latestOrder.status,
            createdAt: latestOrder.createdAt,
            updatedAt: latestOrder.updatedAt || null,
          });

          // Finished orders do not need an open stream.
          if (
            ["delivered", "cancelled"].includes(
              String(latestOrder.status).toLowerCase()
            )
          ) {
            closeStream();
          }
        }
      }

      request.signal.addEventListener("abort", closeStream, { once: true });

      // Send the current status immediately, then check for changes.
      publishStatus();

      if (!closed) {
        intervalId = setInterval(publishStatus, 3000);

        // Keep the connection alive even while status is unchanged.
        heartbeatId = setInterval(() => {
          if (closed) return;

          try {
            controller.enqueue(encoder.encode(": keep-alive\n\n"));
          } catch {
            closeStream();
          }
        }, 20000);
      }
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
