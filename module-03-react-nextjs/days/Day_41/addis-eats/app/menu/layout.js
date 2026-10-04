import Link from "next/link";

function MenuLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F4EC]">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {/* ================================
            SIDEBAR
        ================================= */}

        <aside className="w-full border-b border-[#E3D8D0] bg-white px-5 py-6 md:sticky md:top-[72px] md:h-[calc(100vh-72px)] md:w-64 md:shrink-0 md:border-b-0 md:border-r">
          <h2 className="mb-5 text-xl font-bold text-[#7A263A]">
            Categories
          </h2>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/menu"
                  className="block rounded-lg px-4 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F1E2E5] hover:text-[#7A263A]"
                >
                  All Dishes
                </Link>
              </li>

              <li>
                <Link
                  href="/menu?category=fasting"
                  className="block rounded-lg px-4 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F1E2E5] hover:text-[#7A263A]"
                >
                  Fasting
                </Link>
              </li>

              <li>
                <Link
                  href="/menu?category=traditional"
                  className="block rounded-lg px-4 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F1E2E5] hover:text-[#7A263A]"
                >
                  Traditional
                </Link>
              </li>

              <li>
                <Link
                  href="/menu?category=breakfast"
                  className="block rounded-lg px-4 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F1E2E5] hover:text-[#7A263A]"
                >
                  Breakfast
                </Link>
              </li>

              <li>
                <Link
                  href="/menu?category=snacks"
                  className="block rounded-lg px-4 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F1E2E5] hover:text-[#7A263A]"
                >
                  Snacks
                </Link>
              </li>

              <li>
                <Link
                  href="/menu?category=fast-food"
                  className="block rounded-lg px-4 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F1E2E5] hover:text-[#7A263A]"
                >
                  Fast Food
                </Link>
              </li>

              <li>
                <Link
                  href="/menu?category=drinks"
                  className="block rounded-lg px-4 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F1E2E5] hover:text-[#7A263A]"
                >
                  Drinks
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* ================================
            MENU CONTENT
        ================================= */}

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MenuLayout;