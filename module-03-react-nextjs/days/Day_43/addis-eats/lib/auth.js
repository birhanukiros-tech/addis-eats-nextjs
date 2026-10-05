import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const users = {
  [process.env.ADDIS_EATS_CUSTOMER_USERNAME]: {
    passwordHash: process.env.ADDIS_EATS_CUSTOMER_PASSWORD_HASH,
    role: "customer",
  },

  [process.env.ADDIS_EATS_STAFF_USERNAME]: {
    passwordHash: process.env.ADDIS_EATS_STAFF_PASSWORD_HASH,
    role: "staff",
  },
};

export async function getCurrentCustomer() {
  const cookieStore = await cookies();

  const username = cookieStore.get("addis-eats-customer")?.value;

  if (!username) {
    return null;
  }

  const user = users[username];

  if (!user) {
    return null;
  }

  return {
    username,
    role: user.role,
  };
}

export async function loginCustomer(username, password) {
  const user = users[username];

  if (!user || !user.passwordHash) {
    return {
      success: false,
      error: "Invalid username or password.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return {
      success: false,
      error: "Invalid username or password.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("addis-eats-customer", username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    username,
    role: user.role,
  };
}

export async function logoutCustomer() {
  const cookieStore = await cookies();

  cookieStore.delete("addis-eats-customer");
}