import Link from "next/link";
import Image from "next/image";

function HomePage() {
  return (
    <>
      <main className="bg-[#faf6ed] text-[#3b2812]">
        {/* =================================
            HERO
        ================================= */}

        <section className="relative min-h-[680px] overflow-hidden">
          {/* Background Image */}

          <Image
            src="/images/hero-dish.jpg"
            alt="Delicious Ethiopian food"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Dark overlay */}

          <div className="absolute inset-0 bg-black/55" />

          {/* Hero Content */}

          <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-center justify-center px-6 py-20 text-center text-white">
            <div className="max-w-6xl">
              <p
                className="mb-6 text-lg font-semibold tracking-[0.25em] text-[#f0d58a]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                <Image
                  src="/logo.png"
                  alt="Addis Eats logo"
                  width={24}
                  height={24}
                  className="mr-1 inline-block align-middle"
                />
                ADDIS EATS
              </p>

              <h1
                className="mb-8 text-5xl font-bold leading-tight sm:text-6xl lg:text-8xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                የኢትዮጵያን ጣዕም
                <span className="mt-3 block text-[#f0d58a]">
                  እስከ ቤትዎ ድረስ እናመጣለን
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
                Discover delicious Ethiopian food made with authentic flavors,
                fresh ingredients, and a taste that feels like home.
              </p>

              {/* Three statements + center message */}

              <div className="mx-auto mb-10 grid max-w-5xl gap-5 md:grid-cols-3">
                <div
                  className="rounded-2xl border border-white/20 bg-black/20 px-5 py-6 backdrop-blur-sm"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  <p className="text-xl font-bold">ጣዕሙ የሚያስደስት ምግብ</p>
                </div>

                <div
                  className="flex items-center justify-center rounded-2xl border border-[#f0d58a]/50 bg-[#d6ae52]/90 px-5 py-6 text-[#3b2812] shadow-xl"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  <p className="text-xl font-bold leading-relaxed">
                    ጉሮሮን የምያርካ መጠጥ
                  </p>
                </div>

                <div
                  className="rounded-2xl border border-white/20 bg-black/20 px-5 py-6 backdrop-blur-sm"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  <p className="text-xl font-bold">ትዝታ የሚፈጥር ጊዜ</p>
                </div>
              </div>

              <div
                className="mx-auto mb-10 max-w-3xl rounded-2xl border border-white/20 bg-black/20 px-6 py-5 backdrop-blur-sm"
                style={{ fontFamily: "Georgia, serif" }}
              >
                <p className="text-xl font-bold sm:text-2xl">
                  ከእኛ ጋር ያገኛሉ <br />
                  ይምጡ ይደሰቱ!
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/menu"
                  className="rounded-xl bg-[#d6ae52] px-7 py-4 font-bold text-[#3b2812] shadow-xl transition hover:-translate-y-1 hover:bg-[#e1bd68]"
                >
                  የምግቦች ዝርዝርን ይመልከቱ
                </Link>

                <Link
                  href="/menu"
                  className="rounded-xl border-2 border-white px-7 py-4 font-bold text-white transition hover:bg-white hover:text-[#3b2812]"
                >
                  Explore Menu
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =================================
            INTRODUCTION
        ================================= */}

        <section className="mx-auto max-w-4xl px-6 pt-10 pb-5 text-center md:pt-12 md:pb-6">
          <p
            className="mb-4 text-sm font-bold tracking-[0.2em] text-[#8b681f]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            WELCOME TO ADDIS EATS
          </p>

          <h2
            className="mb-3 text-2xl font-bold leading-relaxed text-[#3b2812] sm:text-3xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            ጣዕሙ የሚያስደስት ምግብ፣ ትዝታ የሚፈጥር ጊዜ፣ ጉሮሮን የምያርካ መጠጥ ከእኛ ጋር ያገኛሉ
          </h2>

          <h2
            className="mb-5 text-2xl font-bold text-[#8b681f] sm:text-3xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            ይምጡ ይደሰቱ!
          </h2>

          <p className="text-base leading-8 text-[#66563e] sm:text-lg">
            Addis Eats brings the rich and unique flavors of Ethiopian cuisine
            closer to you. From traditional favorites to refreshing drinks,
            discover something delicious for every moment.
          </p>
        </section>

        {/* =================================
            TODAY'S SPECIAL
        ================================= */}

        <section className="mx-auto max-w-7xl px-6 pt-5 pb-12 md:pt-6 md:pb-14">
          <div className="mb-8 text-center">
            <p
              className="mb-3 text-sm font-bold tracking-[0.2em] text-[#8b681f]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              TODAY'S SPECIAL
            </p>

            <h2
              className="text-3xl font-bold text-[#3b2812] sm:text-4xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              የዛሬ ልዩ ምግቦች
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {/* Doro Wot */}

            <article className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">
              <Image
                src="/images/doro-wet.png"
                alt="Doro Wot"
                width={500}
                height={350}
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3
                  className="mb-2 text-2xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Doro Wot
                </h3>

                <p className="mb-4 text-lg font-bold text-[#8b681f]">600 ETB</p>

                <Link
                  href="/menu/4"
                  className="font-bold text-[#6d5118] hover:text-[#3b2812]"
                >
                  View Dish →
                </Link>
              </div>
            </article>

            {/* Kitfo */}

            <article className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">
              <Image
                src="/images/kitfo.png"
                alt="Kitfo"
                width={500}
                height={350}
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3
                  className="mb-2 text-2xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Kitfo
                </h3>

                <p className="mb-4 text-lg font-bold text-[#8b681f]">500 ETB</p>

                <Link
                  href="/menu/5"
                  className="font-bold text-[#6d5118] hover:text-[#3b2812]"
                >
                  View Dish →
                </Link>
              </div>
            </article>

            {/* Shiro */}

            <article className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">
              <Image
                src="/images/shiro.png"
                alt="Shiro"
                width={500}
                height={350}
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3
                  className="mb-2 text-2xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Shiro
                </h3>

                <p className="mb-4 text-lg font-bold text-[#8b681f]">200 ETB</p>

                <Link
                  href="/menu/1"
                  className="font-bold text-[#6d5118] hover:text-[#3b2812]"
                >
                  View Dish →
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* =================================
            CATEGORIES
        ================================= */}

        <section className="mx-auto max-w-7xl px-6 pt-5 pb-12 md:pt-6 md:pb-14">
          <div className="mb-8 text-center">
            <p
              className="mb-3 text-sm font-bold tracking-[0.2em] text-[#8b681f]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              WHAT ARE YOU CRAVING?
            </p>

            <h2
              className="text-3xl font-bold text-[#3b2812] sm:text-4xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              የሚወዱትን ጣዕም ይምረጡ
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {/* Traditional */}

            <article className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">
              <Image
                src="/images/kitfo.png"
                alt="Traditional Ethiopian food"
                width={500}
                height={300}
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-52 w-full object-cover"
              />

              <div className="p-6">
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  ባህላዊ ምግቦች
                </h3>

                <p className="mb-5 leading-7 text-[#66563e]">
                  Enjoy authentic Ethiopian dishes prepared with traditional
                  flavors.
                </p>

                <Link
                  href="/menu?category=traditional"
                  className="font-bold text-[#6d5118] hover:text-[#3b2812]"
                >
                  የምግቦች ዝርዝርን ይመልከቱ →
                </Link>
              </div>
            </article>

            {/* Fasting */}

            <article className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">
              <Image
                src="/images/beyaynet.png"
                alt="Fasting Ethiopian food"
                width={500}
                height={300}
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-52 w-full object-cover"
              />

              <div className="p-6">
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  የጾም ምግቦች
                </h3>

                <p className="mb-5 leading-7 text-[#66563e]">
                  Delicious plant-based choices prepared for fasting days and
                  everyone who loves them.
                </p>

                <Link
                  href="/menu?category=fasting"
                  className="font-bold text-[#6d5118] hover:text-[#3b2812]"
                >
                  የጾም ምግቦች →
                </Link>
              </div>
            </article>

            {/* Drinks */}

            <article className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">
              <Image
                src="/images/fanta.png"
                alt="Refreshing drinks"
                width={500}
                height={300}
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-52 w-full object-cover"
              />

              <div className="p-6">
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  መጠጦች
                </h3>

                <p className="mb-5 leading-7 text-[#66563e]">
                  Refresh your meal with a selection of cold and delicious
                  drinks.
                </p>

                <Link
                  href="/menu?category=drinks"
                  className="font-bold text-[#6d5118] hover:text-[#3b2812]"
                >
                  መጠጦችን ይመልከቱ →
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* =================================
            READY TO EAT
        ================================= */}

        <section className="mx-6 mb-14 mt-4 rounded-3xl bg-[#e8d19a] px-7 py-10 md:mx-auto md:max-w-6xl md:px-12">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className="mb-3 text-sm font-bold tracking-[0.2em] text-[#6d5118]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                READY TO EAT?
              </p>

              <h2
                className="mb-3 text-2xl font-bold text-[#3b2812] sm:text-3xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                የሚወዱት ምግብ እዚህ ይጠብቀዎታል!
              </h2>

              <p className="leading-7 text-[#66563e]">
                Browse our menu and find your next favorite Ethiopian dish.
              </p>
            </div>

            <Link
              href="/menu"
              className="shrink-0 rounded-xl bg-[#3b2812] px-6 py-3.5 text-center font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#5a3d18]"
            >
              ወደ የምግብ ዝርዝር መውጫ ይሂዱ →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
