
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/auth";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer();

  if (!customer || customer.role !== "customer") {
    redirect("/login?next=%2Fcheckout");
  }

  return <CheckoutClient />;
}
