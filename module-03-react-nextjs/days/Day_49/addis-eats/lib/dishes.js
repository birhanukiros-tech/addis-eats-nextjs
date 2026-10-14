import fs from "fs/promises";
import path from "path";

export function createDishSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getDishes() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "dishes.json"
  );

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file);
}

export async function getDish(identifier) {
  const dishes = await getDishes();

  return dishes.find(
    (dish) =>
      String(dish.id) === String(identifier) ||
      createDishSlug(dish.name) === String(identifier)
  );
}