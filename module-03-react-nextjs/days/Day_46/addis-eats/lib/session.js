
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("addis-eats-customer")?.value;

  return verifySessionToken(token);
}