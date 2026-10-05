import { getDishes } from "@/lib/dishes";

export async function GET(request, { params}) {
    const { id } = await params;

    const dishes = await getDishes();

    const dish = dishes.find((dish) => String(dish.id) === id);

    if (!dish) {
    return Response.json(
        {error: "No such Dish"},
        {status: 404}
    );
    }
    return Response.json(dish);
}