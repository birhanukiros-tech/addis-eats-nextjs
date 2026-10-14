"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

function Providers({ children, customer }) {
  const customerId = customer?.username || customer?.email || null;

  const cartKey = customerId
    ? `addis-eats-cart-${customerId}`
    : "addis-eats-cart-guest";

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadedKey, setLoadedKey] = useState(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(cartKey);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      setCart(Array.isArray(parsedCart) ? parsedCart : []);
    } catch {
      setCart([]);
    }

    setLoadedKey(cartKey);
  }, [cartKey]);

  useEffect(() => {
    // Don't save the previous customer's cart under the new customer's key.
    if (loadedKey !== cartKey) return;

    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey, loadedKey]);

  // Hide the previous customer's cart while the new cart loads.
  const visibleCart = loadedKey === cartKey ? cart : [];

  function addToCart(dish) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === dish.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentCart, { ...dish, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function removeFromCart(id) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  function increaseQuantity(id) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function openCartDrawer() {
    setCartOpen(true);
  }

  function closeCartDrawer() {
    setCartOpen(false);
  }

  const cartTotal = visibleCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartCount = visibleCart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function clearCart() {
    setCart([]);
    setCartOpen(false);
  }

  return (
    <CartContext.Provider
      value={{
        customerId,
        cart: visibleCart,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartOpen,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside Providers");
  }

  return context;
}

export default Providers;
