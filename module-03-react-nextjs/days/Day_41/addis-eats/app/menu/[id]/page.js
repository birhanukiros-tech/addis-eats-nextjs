import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDishes } from "@/lib/dishes";

export async function generateStaticParams() {
  const dishes = await getDishes();

  return dishes.map((dish) => ({
    id: String(dish.id),
  }));
}

export default async function DishPage({ params }) {
  const { id } = await params;

  const dishes = await getDishes();

  const dish = dishes.find((dish) => String(dish.id) === id);

  if (!dish) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8F4EC] px-5 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-6xl">
        {/* =================================
            BACK TO MENU
        ================================= */}

        <Link
          href="/menu"
          className="mb-8 inline-flex items-center font-bold text-[#7A263A] transition hover:text-[#A64B5D]"
        >
          ← Back to Menu
        </Link>

        {/* =================================
            DISH DETAIL CARD
        ================================= */}

        <div className="overflow-hidden rounded-3xl border border-[#E8DDD8] bg-white shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* =================================
                IMAGE
            ================================= */}

            <div className="relative min-h-[350px] overflow-hidden bg-[#F1E2E5] md:min-h-[600px]">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                priority
                className="object-cover"
              />

              {/* Category Badge */}

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold capitalize text-[#7A263A] shadow-md">
                  {dish.category.replace("-", " ")}
                </span>
              </div>
            </div>

            {/* =================================
                CONTENT
            ================================= */}

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              {/* Small Label */}

              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#A64B5D]">
                ADDIS EATS
              </p>

              {/* Dish Name */}

              <h1
                className="mb-5 text-4xl font-bold text-[#2F2F2F] sm:text-5xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {dish.name}
              </h1>

              {/* Description */}

              <p className="mb-7 text-base leading-8 text-[#666666] sm:text-lg">
                {dish.description}
              </p>

              {/* Price */}

              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#777777]">
                  Price
                </p>

                <p className="mt-1 text-3xl font-bold text-[#7A263A]">
                  {dish.price} ETB
                </p>
              </div>

              {/* Details */}

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#F8F4EC] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                    Category
                  </p>

                  <p className="mt-1 font-bold capitalize text-[#2F2F2F]">
                    {dish.category.replace("-", " ")}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8F4EC] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                    Spice Level
                  </p>

                  <p className="mt-1 font-bold text-[#2F2F2F]">
                    {dish.spicy ? "🌶️ Spicy" : "Not Spicy"}
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cart"
                  className="rounded-xl bg-[#7A263A] px-6 py-3.5 text-center font-bold text-white shadow-md transition hover:bg-[#A64B5D]"
                >
                  Add to Cart
                </Link>

                <Link
                  href="/menu"
                  className="rounded-xl border-2 border-[#7A263A] px-6 py-3.5 text-center font-bold text-[#7A263A] transition hover:bg-[#F1E2E5]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
