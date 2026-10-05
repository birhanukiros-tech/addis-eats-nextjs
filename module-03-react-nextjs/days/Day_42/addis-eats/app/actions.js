"use server";

import { revalidatePath } from "next/cache";
import { orderSchema } from "@/lib/validations";
import {
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
} from "@/lib/auth";
import {
  saveOrder,
  getOrder,
  updateOrder,
} from "@/lib/orders";

export async function login(previousState, formData) {
  const username = formData.get("username")?.trim();
  const password = formData.get("password")?.trim();

  if (!username || !password) {
    return {
      error: "Username and password are required.",
    };
  }

  const result = await loginCustomer(username, password);

  if (!result.success) {
    return {
      error: result.error,
    };
  }

  return {
    success: true,
    username: result.username,
    role: result.role,
  };
}

export async function logout() {
  await logoutCustomer();

  return {
    success: true,
  };
}

export async function placeOrder(previousState, formData) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return {
      error: "You must be signed in before placing an order.",
    };
  }

  const values = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  const result = orderSchema.safeParse(values);

  if (!result.success) {
    const fieldErrors = {};

    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];

      fieldErrors[fieldName] = issue.message;
    });

    return {
      error: "Validation failed",
      fieldErrors,
    };
  }

  const order = {
  id: Date.now().toString(),
  customerId: customer.username,
  ...result.data,
  items: JSON.parse(formData.get("items") || "[]"),
  subtotal: Number(formData.get("subtotal") || 0),
  deliveryFee: Number(formData.get("deliveryFee") || 0),
  total: Number(formData.get("total") || 0),
  status: "Preparing",
  createdAt: new Date().toISOString(),
};

  saveOrder(order);

  console.log("Order:", order);

  revalidatePath("/orders");

  return {
    success: true,
    message: "Order placed successfully",
    order,
  };
}

export async function cancelOrder(orderId) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return {
      success: false,
      error: "You must be signed in to cancel an order.",
    };
  }

  const order = getOrder(orderId);

  if (!order) {
    return {
      success: false,
      error: "Order not found.",
    };
  }

  if (order.customerId !== customer.username) {
    return {
      success: false,
      error: "You are not allowed to cancel this order.",
    };
  }

  updateOrder(orderId, {
    status: "Cancelled",
  });

  revalidatePath("/orders");

  return {
    success: true,
    message: "Order cancelled successfully.",
  };
}