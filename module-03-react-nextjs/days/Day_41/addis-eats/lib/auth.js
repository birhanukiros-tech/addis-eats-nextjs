import { cookies } from "next/headers";

export async function getCurrentCustomer() {
  const cookieStore = await cookies();

  const username = cookieStore.get("addis-eats-customer")?.value;

  if (!username) {
    return null;
  }

  return {
    username,
  };
}

export async function loginCustomer(username) {
  const cookieStore = await cookies();

  cookieStore.set("addis-eats-customer", username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function logoutCustomer() {
  const cookieStore = await cookies();

  cookieStore.delete("addis-eats-customer");
}