"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/app/actions";

function CancelOrderButton({ orderId }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleCancel() {
    setMessage("");

    startTransition(async () => {
      const result = await cancelOrder(orderId);

      if (!result.success) {
        setMessage(result.error);
        return;
      }

      setMessage("Order cancelled successfully.");

      router.refresh();
    });
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isPending}
        className="rounded-lg border border-[#A23B3B] px-4 py-2 text-sm font-bold text-[#A23B3B] transition hover:bg-[#A23B3B] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Cancelling..." : "Cancel Order"}
      </button>

      {message && (
        <p className="mt-2 text-sm font-semibold text-[#7A263A]">
          {message}
        </p>
      )}
    </div>
  );
}

export default CancelOrderButton;