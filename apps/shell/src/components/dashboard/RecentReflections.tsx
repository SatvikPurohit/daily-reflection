"use client";

import Link from "next/link";
import { useReflections, useDeleteReflection } from "@/hooks/useReflections";

const moodColor = (mood: number) => {
  if (mood >= 7) return "bg-emerald-400";
  if (mood >= 5) return "bg-amber-400";
  return "bg-rose-400";
};

export function RecentReflections() {
  const { data, isLoading } = useReflections(5);
  const deleteReflection = useDeleteReflection();

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Reflections
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-2 h-12 bg-slate-200 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded mb-1 w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const reflections = data?.reflections ?? [];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Reflections
        </h2>
        <Link
          href="/reflect"
          className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
        >
          + Add new
        </Link>
      </div>

      {reflections.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-slate-500">No reflections yet.</p>
          <Link
            href="/reflect"
            className="mt-3 inline-block text-indigo-500 hover:text-indigo-600 font-medium text-sm"
          >
            Log your first reflection →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reflections.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <div
                className={`w-2 mt-1.5 h-2 rounded-full flex-shrink-0 ${moodColor(entry.mood)}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      Mood: {entry.mood}/10
                    </span>
                    <span className="text-sm text-slate-500">
                      Urge: {entry.urge}/10
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(entry.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {entry.context && (
                  <p className="text-sm text-slate-500 mt-0.5 truncate">
                    {entry.context}
                  </p>
                )}
                {entry.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.emotions.slice(0, 3).map((e) => (
                      <span
                        key={e}
                        className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteReflection.mutate(entry.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-400 transition-all text-xs p-1"
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
