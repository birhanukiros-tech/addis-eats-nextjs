import { notFound, redirect } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";
import TrackOrderClient from "./TrackOrderClient";

export const metadata = {
  title: "Track Your Delivery | Addis Eats",
  description: "Track your Addis Eats order and delivery status.",
};

export default async function TrackOrderPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(`/track/${id}`)}`);
  }

  const order = getOrder(id);

  // If the server has the order, enforce ownership.
  if (
    order &&
    session.role !== "staff" &&
    String(order.customerId).toLowerCase() !==
      String(session.username).toLowerCase()
  ) {
    notFound();
  }

  // If this server instance has no order, let the browser
  // try its own saved order history.
  return (
    <TrackOrderClient
      orderId={String(id)}
      username={session.username}
      role={session.role}
      initialOrder={order ?? null}
    />
  );
}
