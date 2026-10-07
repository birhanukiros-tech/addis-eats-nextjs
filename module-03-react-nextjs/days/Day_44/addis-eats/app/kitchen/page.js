import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

async function KitchenPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/kitchen");
  }

  if (session.role !== "staff") {
    redirect("/orders");
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-[#7A263A] px-6 py-10 text-center shadow-lg sm:px-10">
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
            ADDIS EATS
          </p>

          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Kitchen Dashboard
          </h1>

          <p className="mt-3 text-[#F1E2E5]">
            Staff-only area
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-[#E8DDD8] bg-white p-8 shadow-sm">
          <h2
            className="text-2xl font-bold text-[#2F2F2F]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Welcome, {session.username}
          </h2>

          <p className="mt-2 text-[#666666]">
            You have staff access to the Addis Eats kitchen.
          </p>
        </div>
      </div>
    </main>
  );
}

export default KitchenPage;