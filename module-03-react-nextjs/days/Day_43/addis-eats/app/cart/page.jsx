"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/Providers";

function CartPage() {
  const {
    cart,
    cartTotal,
    cartCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] px-5 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 rounded-3xl bg-[#7A263A] px-6 py-12 shadow-lg">
            <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
              ADDIS EATS
            </p>

            <h1
              className="text-4xl font-bold text-white sm:text-5xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your Cart
            </h1>
          </div>

          <div className="rounded-3xl border border-[#E8DDD8] bg-white px-6 py-16 shadow-sm">
            <div className="mb-5 text-6xl">🛒</div>

            <h2
              className="mb-3 text-2xl font-bold text-[#2F2F2F]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your cart is empty
            </h2>

            <p className="mx-auto mb-7 max-w-md text-[#666666]">
              You haven't added any delicious Ethiopian dishes yet.
              Explore our menu and find something you love.
            </p>

            <Link
              href="/menu"
              className="inline-block rounded-xl bg-[#7A263A] px-7 py-3.5 font-bold text-white transition hover:bg-[#A64B5D]"
            >
              Explore Menu →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* =================================
            HEADER
        ================================= */}

        <div className="mb-8 rounded-3xl bg-[#7A263A] px-6 py-10 text-center shadow-lg sm:px-10">
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
            ADDIS EATS
          </p>

          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your Cart
          </h1>

          <p className="mt-3 text-[#F1E2E5]">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* =================================
            CART CONTENT
        ================================= */}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Cart Items */}

          <section className="space-y-5">
            {cart.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[#E8DDD8] bg-white shadow-sm"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}

                  <Image
                    src={item.image}
                    alt={item.name}
                    width={220}
                    height={180}
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="h-52 w-full object-cover sm:h-44 sm:w-52"
                  />

                  {/* Details */}

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2
                            className="text-xl font-bold text-[#2F2F2F]"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {item.name}
                          </h2>

                          <p className="mt-1 text-sm capitalize text-[#777777]">
                            {item.category.replace("-", " ")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm font-bold text-[#A64B5D] transition hover:text-[#7A263A]"
                        >
                          Remove
                        </button>
                      </div>

                      <p className="mt-3 font-bold text-[#7A263A]">
                        {item.price} ETB
                      </p>
                    </div>

                    {/* Quantity */}

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-xl border border-[#D8C9C5]">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-4 py-2 font-bold text-[#7A263A] transition hover:bg-[#F1E2E5]"
                        >
                          −
                        </button>

                        <span className="min-w-12 border-x border-[#D8C9C5] px-4 py-2 text-center font-bold text-[#2F2F2F]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="px-4 py-2 font-bold text-[#7A263A] transition hover:bg-[#F1E2E5]"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-lg font-bold text-[#2F2F2F]">
                        {item.price * item.quantity} ETB
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* =================================
              ORDER SUMMARY
          ================================= */}

          <aside className="h-fit rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2
              className="mb-6 text-2xl font-bold text-[#2F2F2F]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Order Summary
            </h2>

            <div className="space-y-4 border-b border-[#E8DDD8] pb-5">
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
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between py-5">
              <span className="text-lg font-bold text-[#2F2F2F]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#7A263A]">
                {cartTotal} ETB
              </span>
            </div>

            <Link
              href="/checkout"
              className="block rounded-xl bg-[#7A263A] px-6 py-4 text-center font-bold text-white shadow-md transition hover:bg-[#A64B5D]"
            >
              Proceed to Checkout →
            </Link>

            <Link
              href="/menu"
              className="mt-3 block rounded-xl border-2 border-[#7A263A] px-6 py-3 text-center font-bold text-[#7A263A] transition hover:bg-[#F1E2E5]"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CartPage;