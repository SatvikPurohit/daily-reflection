import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 mt-1">
          Understand your mood and urge patterns
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
