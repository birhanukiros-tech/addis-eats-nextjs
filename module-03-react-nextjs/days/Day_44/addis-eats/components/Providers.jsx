"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

function Providers({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("addis-eats-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("addis-eats-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(dish) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === dish.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...dish,
          quantity: 1,
        },
      ];
    });

    // Always open the drawer when an item is added.
    setCartOpen(true);
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  function increaseQuantity(id) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function openCartDrawer() {
    setCartOpen(true);
  }

  function closeCartDrawer() {
    setCartOpen(false);
  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
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