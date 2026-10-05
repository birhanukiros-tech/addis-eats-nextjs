import { cookies } from "next/headers";

const users = {
  [process.env.ADDIS_EATS_CUSTOMER_USERNAME]: {
    role: "customer",
  },

  [process.env.ADDIS_EATS_STAFF_USERNAME]: {
    role: "staff",
  },
};

export async function getSession() {
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