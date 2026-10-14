"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

function Providers({ children, customer }) {
  const customerId = customer?.username || customer?.email || null;

  const cartKey = customerId
    ? `addis-eats-cart-${customerId}`
    : "addis-eats-cart-guest";

  const favoritesKey = customerId
    ? `addis-eats-favorites-${customerId}`
    : "addis-eats-favorites-guest";

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadedKey, setLoadedKey] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [loadedFavoritesKey, setLoadedFavoritesKey] = useState(null);

  const [theme, setTheme] = useState("light");
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load the current customer's cart.
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

  // Save the cart only after the correct cart has loaded.
  useEffect(() => {
    if (loadedKey !== cartKey) return;

    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {
      // Keep the app working if browser storage is unavailable.
    }
  }, [cart, cartKey, loadedKey]);

  const visibleCart = loadedKey === cartKey ? cart : [];

  // Load favorites for the current customer or guest.
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(favoritesKey);
      const parsedFavorites = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
    } catch {
      setFavorites([]);
    }

    setLoadedFavoritesKey(favoritesKey);
  }, [favoritesKey]);

  // Save favorites only after the correct list has loaded.
  useEffect(() => {
    if (loadedFavoritesKey !== favoritesKey) return;

    try {
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    } catch {
      // Keep the app working if browser storage is unavailable.
    }
  }, [favorites, favoritesKey, loadedFavoritesKey]);

  const visibleFavorites =
    loadedFavoritesKey === favoritesKey ? favorites : [];

  function toggleFavorite(dish) {
    setFavorites((currentFavorites) =>
      currentFavorites.some((item) => item.id === dish.id)
        ? currentFavorites.filter((item) => item.id !== dish.id)
        : [...currentFavorites, dish],
    );
  }

  // Load the saved theme once in the browser.
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("addis-eats-theme");

      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }
    } catch {
      // Use light theme if browser storage is unavailable.
    }

    setThemeLoaded(true);
  }, []);

  // Apply and save the selected theme.
  useEffect(() => {
    if (!themeLoaded) return;

    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("addis-eats-theme", theme);
    } catch {
      // The selected theme still works for this session.
    }
  }, [theme, themeLoaded]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  function addToCart(dish) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === dish.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentCart, { ...dish, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id),
    );
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
        favorites: visibleFavorites,
        toggleFavorite,
        theme,
        toggleTheme,
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