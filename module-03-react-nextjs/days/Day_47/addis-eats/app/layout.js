
import "./globals.css";
import { Suspense } from "react";
import Providers from "@/components/Providers";
import SiteChrome from "@/components/SiteChrome";
import { getCurrentCustomer } from "@/lib/auth";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://addis-eats-nextjs-o13s.vercel.app"),

  title: {
    default: "Addis Eats | Ethiopian Food Delivery",
    template: "%s | Addis Eats",
  },

  description:
    "Discover delicious Ethiopian food with Addis Eats. Explore local dishes, browse our menu, and order your favorites.",

  openGraph: {
    title: "Addis Eats | Ethiopian Food Delivery",
    description:
      "Explore traditional Ethiopian dishes, browse the Addis Eats menu, and order your favorite meals for delivery in Addis Ababa.",
    url: "https://addis-eats-nextjs-o13s.vercel.app/",
    siteName: "Addis Eats",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/Addis_eats.jpg",
        width: 1200,
        height: 630,
        alt: "Addis Eats Ethiopian food",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Addis Eats | Ethiopian Food Delivery",
    description: "Discover delicious Ethiopian food with Addis Eats.",
    images: ["/og/Addis_eats.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

async function RootLayout({ children }) {
  const customer = await getCurrentCustomer();

  return (
    <html lang="en" className={inter.className}
     data-scroll-behavior="smooth">
      <body>
        <Providers customer={customer}>
          <Suspense fallback={null}>
            <SiteChrome customer={customer} />
          </Suspense>

          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
