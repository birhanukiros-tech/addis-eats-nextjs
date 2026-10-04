import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-[#F2E8D5] text-[#3b2812]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="mb-5 inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Addis Eats Logo"
              width={54}
              height={54}
              className="h-[54px] w-[54px] object-contain"
            />

            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Addis Eats
            </span>
          </Link>

          <p className="max-w-md leading-7 text-[#4f381c]">
            የኢትዮጵያን ጣዕም እስከ ቤትዎ እናመጣለን።
          </p>

          <p className="mt-3 max-w-md leading-7 text-[#5e4728]">
            Discover delicious Ethiopian food and enjoy the taste of home.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Quick Links
          </h3>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-[#4f381c] transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/menu"
              className="text-[#4f381c] transition hover:text-white"
            >
              Menu
            </Link>

            <Link
              href="/cart"
              className="text-[#4f381c] transition hover:text-white"
            >
              Cart
            </Link>

            <Link
              href="/checkout"
              className="text-[#4f381c] transition hover:text-white"
            >
              Checkout
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Contact Us
          </h3>

          <div className="space-y-3 text-[#4f381c]">
            <p>📍 Addis Ababa, Ethiopia</p>
            <p>📞 +251 900 000 000</p>
            <p>✉️ hello@addiseats.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#b98b2f] px-6 py-4 text-center">
        <p className="text-sm text-[#5e4728]">
          © 2026 Addis Eats. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
