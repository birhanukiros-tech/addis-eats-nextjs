import { getDishes } from "@/lib/dishes";

export default async function sitemap() {
    
const dishes = await getDishes();

return [
    {
        url:"http://localhost:3000/",
    },
    {
        url: "http://localhost:3000/menu",
    },
    
    ...dishes.map((dish) =>({
            url: `http://localhost:3000/menu/${dish.id}`,
    }))
    
];
};