export default function robots() {
    return {
        rules: {
            userAgent:"*",
            disallow: [
                "/cart",
                "/orders",
                "/checkout",
                "/login",
            ]

        },

        sitemap: "http://localhost:3000/sitemap.xml",
    };
}