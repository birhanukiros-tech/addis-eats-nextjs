import { getDishes } from "@/lib/dishes";

export async function GET(request) {
  const dishes = await getDishes();

  const searchParams = new URL(request.url).searchParams;

  const category = searchParams.get("category");
  const search = searchParams.get("search")?.trim().toLowerCase();

  const page = Math.max(
    Number(searchParams.get("page")) || 1,
    1
  );

  const limit = Math.max(
    Number(searchParams.get("limit")) || 6,
    1
  );

  let filteredDishes = dishes;

  if (category) {
    filteredDishes = filteredDishes.filter(
      (dish) => dish.category === category
    );
  }

  if (search) {
    filteredDishes = filteredDishes.filter((dish) =>
      dish.name.toLowerCase().includes(search)
    );
  }

  const total = filteredDishes.length;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedDishes = filteredDishes.slice(start, end);

  return Response.json({
    data: paginatedDishes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}