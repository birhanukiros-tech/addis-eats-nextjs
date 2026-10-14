import { getOrder } from "@/lib/orders";
import { notFound } from "next/navigation";
import OrderStatus from "./OrderStatus";

async function OrderPage({ params }) {
  const { id } = await params;

  const order = getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-6 text-3xl font-bold text-[#7A263A]">
        Order Status
      </h1>

      <OrderStatus order={order} />
    </main>
  );
}

export default OrderPage;