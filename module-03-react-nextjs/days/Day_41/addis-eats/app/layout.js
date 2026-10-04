import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/auth";

async function RootLayout({ children }) {
  const customer = await getCurrentCustomer();

  return (
    <html lang="en">
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