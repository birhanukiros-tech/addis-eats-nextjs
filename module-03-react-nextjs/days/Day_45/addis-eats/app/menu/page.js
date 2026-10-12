import Link from "next/link";
import Image from "next/image";

import { getDishes } from "@/lib/dishes";
import FilterShall from "@/components/Filtershell";

export const revalidate = 3600;

export const metadata = {
  title:"Menu",
  description:"Doro Wet, Tibs, Kitfo and Shiro delivered Across Addis Ababa",
  alternates: {canonical: "/menu"},
};

export default async function MenuPage({ searchParams }) {
  const dishes = await getDishes();

  const params = await searchParams;

  const selectedCategory = params.category || "all";

  const filteredDishes =
    selectedCategory === "all"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

  return (
    <section className="mx-auto max-w-6xl">
      {/* =================================
          MENU HEADER
      ================================= */}

      <div className="mb-8 rounded-3xl bg-[#7A263A] px-6 py-10 text-center shadow-lg sm:px-10">
        <p className="mb-4 text-sm font-bold tracking-[0.25em] text-[#D4AF60]">
          EXPLORE OUR FLAVORS
        </p>

        {/* Addis Eats Logo */}

        <div className="mb-4 flex justify-center">
          <Image
            src="/logo.png"
            alt="Addis Eats Logo"
            width={70}
            height={70}
            sizes="70px"
            className="h-[70px] w-[70px] object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold text-[#FAF6ED] sm:text-5xl">
          Addis Eats Menu
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#F1E2E5] sm:text-lg">
          Discover delicious Ethiopian dishes prepared with authentic flavors,
          fresh ingredients, and traditional inspiration.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block font-bold text-[#D4AF60] transition hover:text-white"
        >
          ← Back to Home
        </Link>
      </div>

      {/* =================================
          CURRENT CATEGORY
      ================================= */}

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-wider text-[#A64B5D]">
            MENU
          </p>

          <h2 className="text-2xl font-bold capitalize text-[#2F2F2F] sm:text-3xl">
            {selectedCategory === "all"
              ? "All Dishes"
              : selectedCategory.replace("-", " ")}
          </h2>
        </div>

        <span className="rounded-full bg-[#F1E2E5] px-4 py-2 text-sm font-bold text-[#7A263A]">
          {filteredDishes.length} dishes
        </span>
      </div>

      {/* =================================
          SEARCH + DISHES
      ================================= */}
      <FilterShall dishes={filteredDishes} category={selectedCategory} />
    </section>
  );
}
