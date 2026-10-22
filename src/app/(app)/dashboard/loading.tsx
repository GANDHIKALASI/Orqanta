import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-7 max-w-7xl animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-12 w-full rounded-xl bg-slate-200/70" />

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-[#dfe8e3] bg-white space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="size-8 rounded-lg bg-slate-100" />
            </div>
            <div className="h-7 w-16 bg-slate-200 rounded" />
            <div className="h-2.5 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Action Shortcuts Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-11 rounded-xl bg-white border border-[#dfe8e3] flex items-center p-3 gap-2"
          >
            <div className="size-5 rounded-md bg-slate-200" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-8 w-24 bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[#dfe8e3] bg-white flex items-center justify-between"
              >
                <div className="space-y-2">
                  <div className="h-4 w-60 bg-slate-200 rounded" />
                  <div className="h-3 w-40 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Cards Skeleton */}
        <div className="space-y-4">
          <div className="h-44 rounded-2xl bg-[#073b3a]/15 border border-emerald-900/10" />
          <div className="h-48 rounded-xl bg-white border border-[#dfe8e3]" />
        </div>
      </div>
    </div>
  );
}
