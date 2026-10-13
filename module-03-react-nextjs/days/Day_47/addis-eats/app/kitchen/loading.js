export default function KitchenLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading admin dashboard"
      className="min-h-screen bg-[#F8F4EC] px-4 py-6 sm:px-6 sm:py-10"
    >
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-40 rounded-3xl bg-[#E8DDD8]" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-white" />
          <div className="h-96 rounded-2xl bg-white" />
        </div>
        <div className="space-y-3 rounded-2xl bg-white p-6">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[#F1E2E5]" />
          ))}
        </div>
      </div>
    </main>
  );
}