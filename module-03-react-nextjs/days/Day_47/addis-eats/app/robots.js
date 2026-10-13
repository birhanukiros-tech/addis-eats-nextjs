
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/orders",
        "/checkout",
        "/login",
        "/kitchen",
      ],
    },
    sitemap: "https://addis-eats-nextjs-o13s.vercel.app/sitemap.xml",
  };
}
