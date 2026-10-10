import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CheckoutForm from "./CheckoutForm";

async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/checkout");
  }

  return <CheckoutForm />;
}

export default CheckoutPage;