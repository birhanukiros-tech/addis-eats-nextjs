import { getDishes } from "@/lib/dishes";
export async function GET(request) {
 const dishes = await getDishes();
 
 const category = new URL(request.url).searchParams.get("category")

 if(!category) {
    return Response.json(dishes);
 }

 const filteredDishes = dishes.filter(
    (dish) => dish.category === category
 )
 return Response.json(filteredDishes);
}