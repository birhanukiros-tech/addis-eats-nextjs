"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Header from "@/components/Header";

export default function SiteChrome({ customer }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdminArea =
    pathname === "/kitchen" || pathname.startsWith("/kitchen/");

  const isAdminLogin =
    pathname === "/login" && searchParams.get("next") === "/kitchen";

  if (isAdminArea || isAdminLogin) {
    return null;
  }

  return <Header customer={customer} />;
}