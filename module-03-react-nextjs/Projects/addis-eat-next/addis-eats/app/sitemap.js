import { getDishes } from "@/lib/dishes";
import { createDishSlug } from "@/lib/dish-slug";

export default async function sitemap() {
  const baseUrl = "https://addis-eats-nextjs-o13s.vercel.app";
  const dishes = await getDishes();

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/menu`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...dishes.map((dish) => ({
      url: `${baseUrl}/menu/${createDishSlug(dish.name)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
