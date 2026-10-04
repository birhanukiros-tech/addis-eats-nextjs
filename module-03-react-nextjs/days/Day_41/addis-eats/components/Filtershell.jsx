"use client";

import { useState } from "react";
import DishList from "./DishList";

function FilterShall({ dishes }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDishes = dishes.filter((dish) => {
    const searchText = searchTerm.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      dish.name.toLowerCase().includes(searchText) ||
      dish.description.toLowerCase().includes(searchText) ||
      dish.category.toLowerCase().includes(searchText)
    );
  });

  return (
    <section>
      {/* =================================
          LIVE SEARCH
      ================================= */}

      <div className="mb-8 rounded-2xl border border-[#E8DDD8] bg-white p-5 shadow-sm">
        <label
          htmlFor="dish-search"
          className="mb-2 block text-sm font-bold uppercase tracking-wider text-[#7A263A]"
        >
          Search Our Menu
        </label>

        <div className="relative">
          <input
            id="dish-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search for a dish..."
            className="w-full rounded-xl border border-[#D8C9C5] bg-[#F8F4EC] px-5 py-3.5 pr-12 text-[#2F2F2F] outline-none transition placeholder:text-[#888888] focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/20"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#7A263A]">
            🔍
          </span>
        </div>

        {/* Search result information */}

        {searchTerm && (
          <p className="mt-3 text-sm text-[#666666]">
            {filteredDishes.length}{" "}
            {filteredDishes.length === 1 ? "dish" : "dishes"} found for{" "}
            <span className="font-bold text-[#7A263A]">
              "{searchTerm}"
            </span>
          </p>
        )}
      </div>

      {/* =================================
          DISHES
      ================================= */}

      {filteredDishes.length > 0 ? (
        <DishList dishes={filteredDishes} />
      ) : (
        <div className="rounded-2xl border border-[#E8DDD8] bg-white px-6 py-14 text-center shadow-sm">
          <div className="mb-4 text-5xl">🍽️</div>

          <h3 className="mb-2 text-2xl font-bold text-[#2F2F2F]">
            No dishes found
          </h3>

          <p className="text-[#666666]">
            Try searching for another dish, category, or ingredient.
          </p>
        </div>
      )}
    </section>
  );
}

export default FilterShall;