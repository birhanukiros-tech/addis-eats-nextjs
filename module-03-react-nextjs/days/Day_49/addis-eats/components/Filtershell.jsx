
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DishList from "./DishList";
import {
  DISHES_UPDATED_EVENT,
  readBrowserDishes,
} from "@/lib/dish-storage";

const PAGE_SIZE = 6;

function FilterShall({ dishes: initialDishes, category = "all" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedPage = Number(searchParams.get("page"));
  const pageFromUrl =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [allDishes, setAllDishes] = useState(initialDishes);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(pageFromUrl);
  const [storageReady, setStorageReady] = useState(false);

  // Load saved Admin changes and keep this menu synchronized.
  useEffect(() => {
    function refreshDishes() {
      setAllDishes(readBrowserDishes(initialDishes));
      setStorageReady(true);
    }

    refreshDishes();

    window.addEventListener("storage", refreshDishes);
    window.addEventListener(DISHES_UPDATED_EVENT, refreshDishes);

    return () => {
      window.removeEventListener("storage", refreshDishes);
      window.removeEventListener(DISHES_UPDATED_EVENT, refreshDishes);
    };
  }, [initialDishes]);

  // Keep page state synchronized with the URL.
  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  // Debounce the search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Only enabled dishes should appear on the customer menu.
  const categoryDishes = useMemo(
    () =>
      allDishes.filter(
        (dish) =>
          dish.enabled !== false &&
          (category === "all" || dish.category === category),
      ),
    [allDishes, category],
  );

  const filteredDishes = useMemo(
    () =>
      categoryDishes.filter((dish) =>
        dish.name.toLowerCase().includes(debouncedSearch),
      ),
    [categoryDishes, debouncedSearch],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDishes.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const displayedDishes = filteredDishes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Keep the URL valid when deletions reduce the number of pages.
  useEffect(() => {
    if (page <= totalPages) return;

    setPage(totalPages);

    const params = new URLSearchParams(searchParams.toString());

    if (totalPages > 1) {
      params.set("page", String(totalPages));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    router.replace(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });
  }, [page, totalPages, router, searchParams]);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    const query = params.toString();
    router.replace(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });
  }

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) return;

    setPage(nextPage);

    const params = new URLSearchParams(searchParams.toString());

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    router.push(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });
  }

  return (
    <section>
      {/* Category heading and live dish count */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-wider text-[#A64B5D]">
            MENU
          </p>

          <h2 className="text-2xl font-bold capitalize text-[#2F2F2F] sm:text-3xl">
            {category === "all"
              ? "All Dishes"
              : category.replace("-", " ")}
          </h2>
        </div>

        <span className="rounded-full bg-[#F1E2E5] px-4 py-2 text-sm font-bold text-[#7A263A]">
          {categoryDishes.length} dishes
        </span>
      </div>

      {/* Search */}
      <div className="mb-8 rounded-2xl border border-[#E8DDD8] bg-white p-5 shadow-sm">
        <label
          htmlFor="dish-search"
          className="mb-2 block text-sm font-bold uppercase tracking-wider text-[#7A263A]"
        >
          Search Our Menu
        </label>

        <input
          id="dish-search"
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a dish..."
          className="w-full rounded-xl border border-[#D8C9C5] bg-[#F8F4EC] px-5 py-3.5 text-[#2F2F2F] outline-none transition placeholder:text-[#888888] focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/20"
        />

        {searchTerm && (
          <p className="mt-3 text-sm text-[#666666]">
            {searchTerm.trim().toLowerCase() !== debouncedSearch
              ? "Searching..."
              : `${filteredDishes.length} ${
                  filteredDishes.length === 1 ? "dish" : "dishes"
                } found for "${searchTerm}"`}
          </p>
        )}
      </div>

      {/* Dish loading state */}
      {!storageReady && (
        <p className="mb-6 text-center text-sm text-[#666666]">
          Loading menu...
        </p>
      )}

      {/* Loaded and empty states */}
      {displayedDishes.length > 0 ? (
        <DishList dishes={displayedDishes} />
      ) : (
        <div className="rounded-2xl border border-[#E8DDD8] bg-white px-6 py-14 text-center shadow-sm">
          <div className="mb-4 text-5xl" aria-hidden="true">
            🍽️
          </div>

          <h3 className="mb-2 text-2xl font-bold text-[#2F2F2F]">
            {debouncedSearch ? "No dishes found" : "No dishes available"}
          </h3>

          <p className="text-[#666666]">
            {debouncedSearch
              ? "Try another dish name."
              : "Please check back later for available dishes."}
          </p>
        </div>
      )}

      {/* URL-based pagination */}
      {filteredDishes.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white transition hover:bg-[#A64B5D] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="font-bold text-[#2F2F2F]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white transition hover:bg-[#A64B5D] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default FilterShall;
