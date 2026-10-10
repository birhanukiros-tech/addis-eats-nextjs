import { getOrder } from "@/lib/orders";

export async function GET(request, { params }) {
  const { id } = await params;

  const order = getOrder(id);

  if (!order) {
    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json(order);
}