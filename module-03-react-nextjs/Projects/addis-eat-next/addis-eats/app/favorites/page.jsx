
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/Providers";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-4 py-10 text-[#26352f] transition-colors sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold">My Favorites ❤️</h1>
        <p className="mb-8">
          Your favorite Ethiopian dishes, all in one place.
        </p>

        {favorites.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="mb-4 text-lg">You haven&apos;t saved any dishes yet.</p>
            <Link
              href="/menu"
              className="inline-block rounded-lg bg-[#176B4D] px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              Explore the Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((dish) => (
              <article
                key={dish.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <Link href={`/menu/${dish.id}`} className="block">
                  <div className="relative h-52 w-full">
                    {dish.image ? (
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        No image available
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <h2 className="mb-2 text-xl font-bold">{dish.name}</h2>
                  <p className="mb-3 line-clamp-3 text-sm text-gray-600">
                    {dish.description}
                  </p>
                  <p className="mb-4 font-bold">
                    {Number(dish.price).toLocaleString()} ETB
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(dish)}
                      className="rounded-lg bg-[#7A263A] px-4 py-2 font-semibold text-white hover:opacity-90"
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(dish)}
                      className="rounded-lg border border-[#7A263A] px-4 py-2 font-semibold text-[#7A263A] hover:bg-[#7A263A] hover:text-white"
                      aria-label={`Remove ${dish.name} from favorites`}
                    >
                      ♥ Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
