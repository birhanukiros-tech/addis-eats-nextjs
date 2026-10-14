
export const DISH_STORAGE_KEY = "addis-eats-dishes-v1";
export const DISHES_UPDATED_EVENT = "addis-eats-dishes-updated";

function normalizeDishes(dishes) {
  return (Array.isArray(dishes) ? dishes : []).map((dish) => ({
    ...dish,
    enabled: dish.enabled !== false,
  }));
}

export function readBrowserDishes(initialDishes = []) {
  const defaults = normalizeDishes(initialDishes);

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const saved = window.localStorage.getItem(DISH_STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return normalizeDishes(parsed);
      }
    }

    window.localStorage.setItem(
      DISH_STORAGE_KEY,
      JSON.stringify(defaults)
    );

    return defaults;
  } catch (error) {
    console.error("Could not read saved dishes:", error);
    return defaults;
  }
}

export function writeBrowserDishes(dishes) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const normalized = normalizeDishes(dishes);

    window.localStorage.setItem(
      DISH_STORAGE_KEY,
      JSON.stringify(normalized)
    );

    window.dispatchEvent(new Event(DISHES_UPDATED_EVENT));
    return true;
  } catch (error) {
    console.error("Could not save dishes:", error);
    return false;
  }
}
