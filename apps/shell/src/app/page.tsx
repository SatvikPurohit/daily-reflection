import Link from "next/link";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { RecentReflections } from "@/components/dashboard/RecentReflections";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good morning 👋</h1>
          <p className="text-slate-500 mt-1">How are you feeling today?</p>
        </div>
        <Link
          href="/reflect"
          className="btn-primary text-sm"
        >
          + Log Reflection
        </Link>
      </div>

      <DashboardSummary />
      <RecentReflections />
    </div>
  );
}
