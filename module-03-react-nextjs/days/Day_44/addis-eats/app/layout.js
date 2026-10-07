import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/auth";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title:{
    template:"%s . Addis Eats",
  default:"Addis Eats - food delivery in Addis Ababa"
},

  descirption:"Food delivery in Ethiopia",

  metadataBase: new URL("http://localhost:3000"),

  openGraph: {
    title:"Addis Eats - food delivery in Addis Ababa",
    descripition: "Order delicious Ethiopian food delivered across Addis Ababa.",
   images: ["/og/Addis_eats.jpg"],
    type: "website",
    locale:"en_ET",

  }
};

async function RootLayout({ children }) {
  const customer = await getCurrentCustomer();

  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <Header customer={customer} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;