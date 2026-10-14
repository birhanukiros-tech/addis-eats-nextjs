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

  const buttonFocus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]";

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F4EC] px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 rounded-3xl bg-[#7A263A] px-6 py-10 shadow-lg sm:py-12">
            <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
              <Image
                src="/logo.png"
                alt=""
                width={20}
                height={20}
                priority
                className="mr-1 inline-block align-middle"
              />
              ADDIS EATS
            </p>

            <h1
              className="text-4xl font-bold text-white sm:text-5xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your Cart
            </h1>
          </div>

          <div className="rounded-3xl border border-[#E8DDD8] bg-white px-5 py-12 shadow-sm sm:px-6 sm:py-16">
            <div className="mb-5 text-6xl" aria-hidden="true">
              🛒
            </div>

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
              className={`inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#7A263A] px-7 py-3.5 font-bold text-white transition hover:bg-[#A64B5D] ${buttonFocus}`}
            >
              Explore Menu →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-3xl bg-[#7A263A] px-5 py-8 text-center shadow-lg sm:px-10 sm:py-10">
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
            ADDIS EATS
          </p>

          <h1
            className="text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your Cart
          </h1>

          <p
            className="mt-3 text-[#F1E2E5]"
            aria-live="polite"
            aria-atomic="true"
          >
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Cart content */}
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Cart items */}
          <section
            aria-label="Shopping cart items"
            className="min-w-0 space-y-5"
          >
            {cart.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[#E8DDD8] bg-white shadow-sm"
              >
                <div className="flex min-w-0 flex-col sm:flex-row">
                  {/* The dish name is provided by the heading below. */}
                  <Image
                    src={item.image}
                    alt=""
                    width={220}
                    height={180}
                    sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) 40vw, 220px"
                    className="h-48 w-full object-cover sm:h-44 sm:w-52 sm:shrink-0"
                  />

                  {/* Dish details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2
                            className="break-words text-xl font-bold text-[#2F2F2F]"
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
                          aria-label={`Remove ${item.name} from cart`}
                          className={`inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg px-2 text-sm font-bold text-[#A64B5D] transition hover:bg-[#F1E2E5] hover:text-[#7A263A] ${buttonFocus}`}
                        >
                          Remove
                        </button>
                      </div>

                      <p className="mt-3 font-bold text-[#7A263A]">
                        {item.price} ETB each
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div
                        className="inline-flex shrink-0 items-center overflow-hidden rounded-xl border border-[#D8C9C5]"
                        aria-label={`Quantity controls for ${item.name}`}
                      >
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className={`flex h-11 w-11 items-center justify-center font-bold text-[#7A263A] transition hover:bg-[#F1E2E5] ${buttonFocus}`}
                        >
                          −
                        </button>

                        <span
                          className="min-w-12 border-x border-[#D8C9C5] px-3 py-2 text-center font-bold text-[#2F2F2F]"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className={`flex h-11 w-11 items-center justify-center font-bold text-[#7A263A] transition hover:bg-[#F1E2E5] ${buttonFocus}`}
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

          {/* Order summary */}
          <aside
            aria-labelledby="cart-summary-heading"
            className="h-fit min-w-0 rounded-3xl border border-[#E8DDD8] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24"
          >
            <h2
              id="cart-summary-heading"
              className="mb-6 text-2xl font-bold text-[#2F2F2F]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Order Summary
            </h2>

            <div className="space-y-4 border-b border-[#E8DDD8] pb-5">
              <div className="flex justify-between gap-3 text-[#666666]">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>

              <div className="flex justify-between gap-3 text-[#666666]">
                <span>Subtotal</span>
                <span className="font-medium">{cartTotal} ETB</span>
              </div>

              <div className="flex justify-between gap-3 text-[#666666]">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between gap-3 py-5">
              <span className="text-lg font-bold text-[#2F2F2F]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#7A263A]">
                {cartTotal} ETB
              </span>
            </div>

            <Link
              href="/checkout"
              className={`flex min-h-[48px] items-center justify-center rounded-xl bg-[#7A263A] px-5 py-4 text-center font-bold text-white shadow-md transition hover:bg-[#A64B5D] ${buttonFocus}`}
            >
              Proceed to Checkout →
            </Link>

            <Link
              href="/menu"
              className={`mt-3 flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#7A263A] px-5 py-3 text-center font-bold text-[#7A263A] transition hover:bg-[#F1E2E5] ${buttonFocus}`}
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