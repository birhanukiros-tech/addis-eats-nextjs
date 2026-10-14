"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/app/actions";

const navItems = [
  {
    label: "Dashboard",
    view: "dashboard",
    href: "/kitchen?view=dashboard",
  },
  {
    label: "Manage Dishes",
    view: "dishes",
    href: "/kitchen?view=dishes",
  },
  {
    label: "Manage Orders",
    view: "orders",
    href: "/kitchen?view=orders",
  },
];

function AdminSidebar({ activeView }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await logout();
      router.replace("/login?next=%2Fkitchen");
      router.refresh();
    });
  }

  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF60]";

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-3xl bg-[#571A2A] p-5 text-white md:min-h-[600px] md:w-64">
      {/* Sidebar Header */}
      <div className="mb-8 border-b border-white/15 pb-5">
        <p className="text-xs font-bold tracking-[0.25em] text-[#D4AF60]">
          ADDIS EATS
        </p>

        <h2
          className="mt-2 text-2xl font-bold"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Admin Panel
        </h2>

        <p className="mt-1 text-sm text-white/70">
          Restaurant management
        </p>
      </div>

      {/* Admin Navigation */}
      <nav
        aria-label="Admin navigation"
        className="flex flex-col gap-2"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.view;

          return (
            <Link
              key={item.view}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-[44px] items-center rounded-xl px-4 py-3 font-semibold transition ${focusStyle} ${
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

      {/* Sign Out */}
      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className={`flex min-h-[44px] w-full items-center rounded-xl border border-white/30 px-4 py-3 text-left font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 ${focusStyle}`}
        >
          {isPending ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;