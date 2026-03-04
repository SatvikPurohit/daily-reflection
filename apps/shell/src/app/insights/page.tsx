import { InsightsList } from "@/components/insights/InsightsList";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Insights</h1>
        <p className="text-slate-500 mt-1">
          AI-powered insights based on your reflection patterns
        </p>
      </div>
      <InsightsList />
    </div>
  );
}
