"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "all",
  "fasting",
  "traditional",
  "breakfast",
  "snacks",
  "fast-food",
  "drinks",
];

function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory =
    searchParams.get("category") || "all";

  function handleCategory(category) {
    if (category === "all") {
      router.push("/menu");
      return;
    }

    router.push(`/menu?category=${category}`);
  }

  return (
    <nav className="category-bar">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategory(category)}
          className={
            selectedCategory === category ? "active" : ""
          }
        >
          {category}
        </button>
      ))}
    </nav>
  );
}

export default CategoryBar;