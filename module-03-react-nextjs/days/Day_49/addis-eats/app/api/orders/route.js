
import { getCurrentCustomer } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";
import { getOrdersFor } from "@/lib/orders";

export async function GET() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return Response.json(
      { error: "You must be signed in to view orders." },
      { status: 401 }
    );
  }

  const orders = getOrdersFor(customer.username);

  return Response.json({ data: orders });
}

export async function POST(request) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return Response.json(
      { error: "You must be signed in before placing an order." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const result = orderSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      fieldErrors[fieldName] = issue.message;
    });

    return Response.json(
      { error: "Validation failed", fieldErrors },
      { status: 422 }
    );
  }

  return Response.json(
    {
      message: "Order received",
      order: {
        ...result.data,
        customerId: customer.username,
      },
    },
    { status: 201 }
  );
}