
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./Providers";
import { createDishSlug } from "@/lib/dish-slug";

function DishList({ dishes }) {
  const { addToCart, favorites, toggleFavorite } = useCart();

  return (
    <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => {
        const isFavorite = favorites.some(
          (favorite) => favorite.id === dish.id
        );

        return (
          <li
            key={dish.id}
            className="group overflow-hidden rounded-3xl border border-[#E8DDD8] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="relative overflow-hidden">
              <Image
                src={dish.image}
                alt={dish.name}
                width={500}
                height={350}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 365px"
                className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-[#7A263A] shadow">
                {dish.category.replace("-", " ")}
              </span>

              <button
                type="button"
                onClick={() => toggleFavorite(dish)}
                aria-label={
                  isFavorite
                    ? `Remove ${dish.name} from favorites`
                    : `Add ${dish.name} to favorites`
                }
                aria-pressed={isFavorite}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
              >
                <span className={isFavorite ? "text-[#7A263A]" : "text-gray-500"}>
                  {isFavorite ? "♥" : "♡"}
                </span>
              </button>
            </div>

            <div className="p-6">
              <h3
                className="mb-2 text-2xl font-bold text-[#2F2F2F]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {dish.name}
              </h3>

              <p className="mb-4 min-h-[56px] text-sm leading-7 text-[#666666]">
                {dish.description}
              </p>

              <div className="mb-5 flex items-center justify-between">
                <p className="text-xl font-bold text-[#A64B5D]">
                  {dish.price} ETB
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    dish.spicy
                      ? "bg-[#FBE7E7] text-[#A23B3B]"
                      : "bg-[#EEF4EE] text-[#4D7654]"
                  }`}
                >
                  {dish.spicy ? "🌶️ Spicy" : "Not Spicy"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/menu/${createDishSlug(dish.name)}`}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#7A263A] px-3 py-3 text-center text-sm font-bold text-[#7A263A] transition hover:bg-[#F1E2E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() => addToCart(dish)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#7A263A] px-3 py-3 text-sm font-bold text-white transition hover:bg-[#A64B5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A263A]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default DishList;
