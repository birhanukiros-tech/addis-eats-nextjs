
import { getOrder, updateOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

const allowedStatuses = [
  "Preparing",
  "Confirmed",
  "Cooking",
  "Ready",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

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

  if (
    session.role !== "staff" &&
    String(order.customerId).toLowerCase() !==
      String(session.username).toLowerCase()
  ) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json(order);
}

export async function PATCH(request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  if (session.role !== "staff") {
    return Response.json({ error: "Staff access required." }, { status: 403 });
  }

  const { id } = await params;
  const existingOrder = getOrder(id);

  if (!existingOrder) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!allowedStatuses.includes(body?.status)) {
    return Response.json({ error: "Invalid order status." }, { status: 400 });
  }

  const updatedOrder = updateOrder(id, {
    status: body.status,
    updatedAt: new Date().toISOString(),
  });

  if (!updatedOrder) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json(updatedOrder);
}
