export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0d0f0e] text-[#f3f5f3]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 lg:px-8">
        <div className="flex h-16 items-center border-b border-white/[0.06]">
          <div className="h-5 w-16 animate-pulse rounded-md bg-white/[0.06]" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#7ee2b8]" />

            <p className="mt-4 text-xs text-white/25">
              Loading Kobo
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
