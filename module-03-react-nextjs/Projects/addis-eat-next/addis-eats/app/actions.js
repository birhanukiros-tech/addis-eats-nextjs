"use server";

import { getDishes } from "@/lib/dishes";
import { revalidatePath } from "next/cache";
import { orderSchema } from "@/lib/validations";
import {
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  googleSignIn,
} from "@/lib/auth";

import {
  saveOrder,
  getOrder,
  updateOrder,
} from "@/lib/orders";


export async function register(formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? ""
  );

  if (!name || !email || !password || !confirmPassword) {
    return {
      success: false,
      error: "Please complete all fields.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters.",
    };
  }

  try {
    const result = await registerCustomer(name, email, password);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      username: result.username,
      role: result.role,
    };
  } catch (error) {
    console.error("Customer registration failed:", error);

    return {
      success: false,
      error: "Registration failed. Please try again.",
    };
  }
}

export async function signInWithGoogle(idToken) {
  if (
    typeof idToken !== "string" ||
    idToken.length === 0 ||
    idToken.length > 10000
  ) {
    return {
      success: false,
      error: "Invalid Google sign-in response.",
    };
  }

  try {
    const result = await googleSignIn(idToken);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      username: result.username,
      role: result.role,
    };
  } catch (error) {
    console.error("Google sign-in failed:", error);

    return {
      success: false,
      error: "Google sign-in failed. Please try again.",
    };
  }
}

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

  const cartItems = JSON.parse(formData.get("items") || "[]");

  const dishes = await getDishes();

  const items = cartItems.map((item) => {
    const dish = dishes.find(
      (dish) => String(dish.id) === String(item.id)
    );

    if (!dish) {
      throw new Error(`Dish not found: ${item.id}`);
    }

    return {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: Number(item.quantity),
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = items.length > 0 ? 100 : 0;

  const total = subtotal + deliveryFee;

  const order = {
    id: Date.now().toString(),
    customerId: customer.username,
    ...result.data,
    items,
    subtotal,
    deliveryFee,
    total,
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