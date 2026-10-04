"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./Providers";

function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {/* Drawer */}
      <aside
        className="pointer-events-auto absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E8DDD8] bg-[#F2E8D5] px-6 py-5">
          <div>
            <h2
              className="text-2xl font-bold text-[#7A263A]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your Cart
            </h2>

            <p className="mt-1 text-sm text-[#666666]">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>

          {/* ONLY way to close drawer */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#7A263A] transition hover:bg-white"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-5xl">🛒</div>

              <h3
                className="mb-2 text-xl font-bold text-[#2F2F2F]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Your cart is empty
              </h3>

              <p className="mb-6 text-sm text-[#666666]">
                Add some delicious Ethiopian dishes to get started.
              </p>

              <Link
                href="/menu"
                className="rounded-xl bg-[#7A263A] px-6 py-3 font-bold text-white transition hover:bg-[#A64B5D]"
              >
                Explore Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E8DDD8] p-4"
                >
                  <div className="flex gap-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-bold text-[#2F2F2F]">
                          {item.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm font-bold text-[#A64B5D] hover:text-[#7A263A]"
                        >
                          ×
                        </button>
                      </div>

                      <p className="mt-1 text-sm text-[#777777]">
                        {item.price} ETB
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center overflow-hidden rounded-lg border border-[#D8C9C5]">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="px-3 py-1.5 font-bold text-[#7A263A] hover:bg-[#F1E2E5]"
                          >
                            −
                          </button>

                          <span className="min-w-9 border-x border-[#D8C9C5] px-2 py-1.5 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="px-3 py-1.5 font-bold text-[#7A263A] hover:bg-[#F1E2E5]"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="font-bold text-[#7A263A]">
                          {item.price * item.quantity} ETB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#E8DDD8] bg-[#F8F4EC] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold text-[#2F2F2F]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#7A263A]">
                {cartTotal} ETB
              </span>
            </div>

            <Link
              href="/cart"
              className="mb-3 block rounded-xl border-2 border-[#7A263A] px-5 py-3 text-center font-bold text-[#7A263A] transition hover:bg-[#F1E2E5]"
            >
              View Full Cart
            </Link>

            <Link
              href="/checkout"
              className="block rounded-xl bg-[#7A263A] px-5 py-3.5 text-center font-bold text-white transition hover:bg-[#A64B5D]"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;