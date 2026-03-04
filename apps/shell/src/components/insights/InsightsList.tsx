"use client";

import { useInsights, useGenerateInsights } from "@/hooks/useInsights";
import type { Insight } from "@repo/shared-types";

const typeConfig: Record<string, { emoji: string; color: string }> = {
  pattern: { emoji: "🔍", color: "bg-violet-50 border-violet-200" },
  trend: { emoji: "📈", color: "bg-blue-50 border-blue-200" },
  suggestion: { emoji: "💡", color: "bg-amber-50 border-amber-200" },
  milestone: { emoji: "🎉", color: "bg-emerald-50 border-emerald-200" },
};

function InsightCard({ insight }: { insight: Insight }) {
  const config = typeConfig[insight.type] ?? { emoji: "💡", color: "bg-slate-50 border-slate-200" };

  return (
    <div className={`rounded-2xl border p-5 ${config.color}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{config.emoji}</span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800">{insight.title}</h3>
            {insight.actionable && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Actionable
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">{insight.description}</p>
          <p className="text-xs text-slate-400 mt-2 capitalize">
            {insight.type} · {new Date(insight.generatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export function InsightsList() {
  const { data, isLoading } = useInsights();
  const generateInsights = useGenerateInsights();

  const insights = data?.insights ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => generateInsights.mutate()}
          disabled={generateInsights.isPending}
          className="btn-primary text-sm"
        >
          {generateInsights.isPending ? "Analyzing..." : "✨ Generate Insights"}
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">🔮</p>
          <p className="text-slate-600 font-medium mb-1">No insights yet</p>
          <p className="text-slate-400 text-sm mb-4">
            Log a few reflections and then generate insights to discover your patterns.
          </p>
          <button
            onClick={() => generateInsights.mutate()}
            disabled={generateInsights.isPending}
            className="btn-primary text-sm"
          >
            {generateInsights.isPending ? "Analyzing..." : "Generate Insights"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
