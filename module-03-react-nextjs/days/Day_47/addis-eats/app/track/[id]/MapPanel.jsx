"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      className="h-80 animate-pulse rounded-2xl bg-[#E8DDD8]"
      aria-label="Loading delivery map"
    />
  ),
});

export default function MapPanel(props) {
  return <DeliveryMap {...props} />;
}