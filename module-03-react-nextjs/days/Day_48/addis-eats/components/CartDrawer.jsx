
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
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

  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusableElements = Array.from(
        drawer.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("hidden"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        drawer.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          !drawer.contains(document.activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastElement ||
          !drawer.contains(document.activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const previousFocus = previousFocusRef.current;

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl focus:outline-none"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E8DDD8] bg-[#F2E8D5] px-6 py-5">
          <div>
            <h2
              id="cart-drawer-title"
              className="text-2xl font-bold text-[#7A263A]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your Cart
            </h2>

            <p
              className="mt-1 text-sm text-[#666666]"
              aria-live="polite"
              aria-atomic="true"
            >
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-[#7A263A] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
            aria-label="Close shopping cart"
          >
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-5xl" aria-hidden="true">
                🛒
              </div>

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
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#7A263A] px-6 py-3 font-bold text-white transition hover:bg-[#A64B5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
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
                      alt=""
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
                          aria-label={`Remove ${item.name} from cart`}
                          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-xl font-bold text-[#A64B5D] hover:bg-[#F1E2E5] hover:text-[#7A263A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
                        >
                          ×
                        </button>
                      </div>

                      <p className="mt-1 text-sm text-[#777777]">
                        {item.price} ETB
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center overflow-hidden rounded-lg border border-[#D8C9C5]">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-11 w-11 items-center justify-center font-bold text-[#7A263A] hover:bg-[#F1E2E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#7A263A]"
                          >
                            −
                          </button>

                          <span
                            className="min-w-10 border-x border-[#D8C9C5] px-2 py-2 text-center text-sm font-bold"
                            aria-label={`${item.name} quantity: ${item.quantity}`}
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-11 w-11 items-center justify-center font-bold text-[#7A263A] hover:bg-[#F1E2E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#7A263A]"
                          >
                            +
                          </button>
                        </div>

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
              <span className="font-bold text-[#2F2F2F]">Total</span>

              <span className="text-2xl font-bold text-[#7A263A]">
                {cartTotal} ETB
              </span>
            </div>

            <Link
              href="/cart"
              className="mb-3 flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#7A263A] px-5 py-3 text-center font-bold text-[#7A263A] transition hover:bg-[#F1E2E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
            >
              View Full Cart
            </Link>

            <Link
              href="/checkout"
              className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#7A263A] px-5 py-3.5 text-center font-bold text-white transition hover:bg-[#A64B5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
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
