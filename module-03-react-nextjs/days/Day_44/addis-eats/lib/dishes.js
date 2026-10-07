import fs from "fs/promises";
import path from "path";

export async function getDishes() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "dishes.json"
  );

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file);
}

export async function getDish(id) {
  const dishes = await getDishes();

  return dishes.find((dish) => String(dish.id) === String(id));
}