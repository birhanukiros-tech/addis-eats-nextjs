"use client";

export default function KitchenError({ error, reset }) {
  return (
    <main className="min-h-[60vh] bg-[#F8F4EC] px-5 py-12">
      <section className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-[#7A263A]">
          Dashboard could not load
        </h1>
        <p className="mt-3 text-[#666666]">
          Something went wrong while loading the dashboard. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white hover:bg-[#A64B5D]"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}