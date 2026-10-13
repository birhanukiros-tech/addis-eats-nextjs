"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import DishList from "./DishList";
import fetcher from "@/lib/fetcher";

function FilterShall({ dishes, category = "all" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedPage = Number(searchParams.get("page"));
  const pageFromUrl =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(pageFromUrl);

  // Keep the selected page synchronized with the URL.
  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  // =================================
  // DEBOUNCE SEARCH
  // =================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
      setPage(1);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Reset pagination when the user changes the search term.
  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setPage(1);

    const params = new URLSearchParams(searchParams.toString());

    if (params.has("page")) {
      params.delete("page");

      const query = params.toString();

      router.replace(query ? `/menu?${query}` : "/menu", {
        scroll: false,
      });
    }
  }

  // =================================
  // PAGINATION + URL
  // =================================

  function handlePageChange(nextPage) {
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

  // =================================
  // NORMAL MENU QUERY
  // =================================

  const categoryQuery =
    category === "all" ? "" : `&category=${encodeURIComponent(category)}`;

  const menuKey = `/api/dishes?page=${page}&limit=6${categoryQuery}`;

  // Use the selected page's dishes for the initial display.
  const initialPageData = {
    data: dishes.slice((page - 1) * 6, page * 6),
    pagination: {
      page,
      limit: 6,
      total: dishes.length,
      totalPages: Math.ceil(dishes.length / 6),
    },
  };

  const {
    data: menuData,
    error: menuError,
    isLoading: menuLoading,
    isValidating: menuValidating,
  } = useSWR(menuKey, fetcher, {
    fallbackData: initialPageData,
    keepPreviousData: true,
    dedupingInterval: 30000,
  });

  // =================================
  // SEARCH QUERY
  // =================================

  const searchKey = debouncedSearch
    ? `/api/dishes?search=${encodeURIComponent(
        debouncedSearch,
      )}&page=${page}&limit=6${categoryQuery}`
    : null;

  const {
    data: searchData,
    error: searchError,
    isLoading: searchLoading,
    isValidating: searchValidating,
  } = useSWR(searchKey, fetcher, {
    keepPreviousData: true,
    dedupingInterval: 30000,
  });

  // =================================
  // CHOOSE WHICH DATA TO DISPLAY
  // =================================

  const activeData = debouncedSearch ? searchData : menuData;

  const displayedDishes = activeData?.data || [];
  const pagination = activeData?.pagination;

  const error = debouncedSearch ? searchError : menuError;
  const isLoading = debouncedSearch ? searchLoading : menuLoading;
  const isValidating = debouncedSearch ? searchValidating : menuValidating;

  return (
    <section>
      {/* SEARCH */}

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
            onChange={handleSearchChange}
            placeholder="Search for a dish..."
            className="w-full rounded-xl border border-[#D8C9C5] bg-[#F8F4EC] px-5 py-3.5 pr-12 text-[#2F2F2F] outline-none transition placeholder:text-[#888888] focus:border-[#7A263A] focus:ring-2 focus:ring-[#7A263A]/20"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#7A263A]">
            🔍
          </span>
        </div>

        {searchTerm && (
          <p className="mt-3 text-sm text-[#666666]">
            {searchLoading
              ? "Searching..."
              : `${searchData?.pagination?.total || 0} ${
                  searchData?.pagination?.total === 1 ? "dish" : "dishes"
                } found for `}
            {!searchLoading && (
              <span className="font-bold text-[#7A263A]">"{searchTerm}"</span>
            )}
          </p>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center">
          <p className="font-semibold text-red-700">Failed to load dishes.</p>
        </div>
      )}

      {/* LOADING */}

      {isLoading && displayedDishes.length === 0 && (
        <p className="mb-6 text-center text-sm text-[#666666]">
          Loading dishes...
        </p>
      )}

      {/* DISHES */}

      {displayedDishes.length > 0 ? (
        <DishList dishes={displayedDishes} />
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

      {/* PAGINATION */}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white transition hover:bg-[#A64B5D] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="font-bold text-[#2F2F2F]">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pagination.totalPages}
            className="rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white transition hover:bg-[#A64B5D] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* BACKGROUND UPDATE */}

      {isValidating && (
        <p className="mt-4 text-center text-sm text-[#666666]">
          Updating results...
        </p>
      )}
    </section>
  );
}

export default FilterShall;
