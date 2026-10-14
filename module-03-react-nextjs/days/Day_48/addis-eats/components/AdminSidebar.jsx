
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/app/actions";

const navItems = [
  { label: "Dashboard", view: "dashboard", href: "/kitchen?view=dashboard" },
  { label: "Manage Dishes", view: "dishes", href: "/kitchen?view=dishes" },
  { label: "Manage Orders", view: "orders", href: "/kitchen?view=orders" },
];

export default function AdminSidebar({ activeView }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await logout();
      router.replace("/login?next=%2Fkitchen");
      router.refresh();
    });
  }

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-3xl bg-[#571A2A] p-5 text-white md:min-h-[600px] md:w-64">
      <div className="mb-8 border-b border-white/15 pb-5">
        <p className="text-xs font-bold tracking-[0.25em] text-[#D4AF60]">
          ADDIS EATS
        </p>
        <h2 className="mt-2 text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
          Admin Panel
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Restaurant management
        </p>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeView === item.view;

          return (
            <Link
              key={item.view}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-xl px-4 py-3 font-semibold transition ${
                isActive
                  ? "bg-[#D4AF60] text-[#32131C]"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className="w-full rounded-xl border border-white/30 px-4 py-3 text-left font-semibold transition hover:bg-white/10 disabled:opacity-60"
        >
          {isPending ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
