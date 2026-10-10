"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { orderSchema } from "@/lib/validations";
import { placeOrder } from "@/app/actions";
import { useCart } from "@/components/Providers";

function CheckoutForm() {
  const router = useRouter();

  const {
    cart,
    cartCount,
    cartTotal,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [actionState, formAction, isPending] = useActionState(
    placeOrder,
    null
  );

  const deliveryFee = cart.length > 0 ? 100 : 0;
  const total = cartTotal + deliveryFee;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function handleSubmit(event) {
    const result = orderSchema.safeParse(formData);

    if (!result.success) {
      event.preventDefault();

      const errors = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        errors[fieldName] = issue.message;
      });

      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }
  }

useEffect(() => {
  if (!actionState?.success) {
    return;
  }

  router.push("/checkout/success");
}, [actionState, router]);

  useEffect(() => {
    if (actionState?.fieldErrors) {
      setFieldErrors(actionState.fieldErrors);
    }
  }, [actionState]);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#E8DDD8] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-5 text-6xl">🛒</div>

          <h1
            className="mb-3 text-3xl font-bold text-[#2F2F2F]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your Cart is Empty
          </h1>

          <p className="mb-7 text-[#666666]">
            Add some delicious Ethiopian dishes before checking out.
          </p>

          <Link
            href="/menu"
            className="inline-block rounded-xl bg-[#7A263A] px-7 py-3.5 font-bold text-white transition hover:bg-[#A64B5D]"
          >
            Explore Menu →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8 rounded-3xl bg-[#7A263A] px-6 py-10 text-center shadow-lg sm:px-10">
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
            ADDIS EATS
          </p>

          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Checkout
          </h1>

          <p className="mt-3 text-[#F1E2E5]">
            Complete your order below
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Customer Form */}
          <section className="rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm sm:p-8">
            <h2
              className="mb-6 text-2xl font-bold text-[#2F2F2F]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Customer Information
            </h2>

            <form
              action={formAction}
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Hidden order information */}
              <input
                type="hidden"
                name="items"
                value={JSON.stringify(cart)}
              />

              <input
                type="hidden"
                name="subtotal"
                value={cartTotal}
              />

              <input
                type="hidden"
                name="deliveryFee"
                value={deliveryFee}
              />

              <input
                type="hidden"
                name="total"
                value={total}
              />

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-[#2F2F2F]"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#D8C9C5] bg-[#F8F4EC] px-4 py-3.5 text-[#2F2F2F] outline-none transition focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/20"
                />

                {fieldErrors.name && (
                  <p className="mt-2 text-sm font-semibold text-[#A23B3B]">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-[#2F2F2F]"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-[#D8C9C5] bg-[#F8F4EC] px-4 py-3.5 text-[#2F2F2F] outline-none transition focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/20"
                />

                {fieldErrors.phone && (
                  <p className="mt-2 text-sm font-semibold text-[#A23B3B]">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-bold text-[#2F2F2F]"
                >
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows="4"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your delivery address"
                  className="w-full resize-none rounded-xl border border-[#D8C9C5] bg-[#F8F4EC] px-4 py-3.5 text-[#2F2F2F] outline-none transition focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/20"
                />

                {fieldErrors.address && (
                  <p className="mt-2 text-sm font-semibold text-[#A23B3B]">
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              {/* Server Error */}
              {actionState?.error &&
                !actionState?.fieldErrors && (
                  <p className="rounded-xl bg-[#F1E2E5] px-4 py-3 text-sm font-semibold text-[#7A263A]">
                    {actionState.error}
                  </p>
                )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-[#7A263A] px-6 py-4 font-bold text-white shadow-md transition hover:bg-[#A64B5D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending
                  ? "Placing Order..."
                  : "Place Order →"}
              </button>

            </form>
          </section>

          {/* Order Summary */}
          <aside className="h-fit rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm lg:sticky lg:top-24">

            <h2
              className="mb-6 text-2xl font-bold text-[#2F2F2F]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Order Summary
            </h2>

            <div className="mb-5 space-y-4 border-b border-[#E8DDD8] pb-5">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-[#2F2F2F]">
                      {item.name}
                    </p>

                    <p className="text-sm text-[#777777]">
                      {item.quantity} × {item.price} ETB
                    </p>
                  </div>

                  <p className="font-bold text-[#7A263A]">
                    {item.price * item.quantity} ETB
                  </p>
                </div>
              ))}

            </div>

            <div className="space-y-3 border-b border-[#E8DDD8] pb-5">

              <div className="flex justify-between text-[#666666]">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>

              <div className="flex justify-between text-[#666666]">
                <span>Subtotal</span>
                <span>{cartTotal} ETB</span>
              </div>

              <div className="flex justify-between text-[#666666]">
                <span>Delivery</span>
                <span>{deliveryFee} ETB</span>
              </div>

            </div>

            <div className="flex items-center justify-between pt-5">

              <span className="text-lg font-bold text-[#2F2F2F]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#7A263A]">
                {total} ETB
              </span>

            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}

export default CheckoutForm;