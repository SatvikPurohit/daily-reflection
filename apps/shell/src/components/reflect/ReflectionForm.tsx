"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateReflection } from "@/hooks/useReflections";

const COMMON_EMOTIONS = [
  "anxious", "calm", "happy", "sad", "angry", "grateful",
  "overwhelmed", "energized", "tired", "hopeful", "frustrated", "peaceful",
];

const COMMON_TRIGGERS = [
  "work stress", "social interaction", "exercise", "poor sleep",
  "conflict", "achievement", "isolation", "mindfulness", "family", "health",
];

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
  description: string;
}

function ScaleSlider({ label, value, onChange, color, description }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold text-slate-700">{label}</label>
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>0 - {description.split("/")[0]}</span>
        <span>10 - {description.split("/")[1]}</span>
      </div>
    </div>
  );
}

export function ReflectionForm() {
  const router = useRouter();
  const createReflection = useCreateReflection();

  const [mood, setMood] = useState(5);
  const [urge, setUrge] = useState(3);
  const [context, setContext] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReflection.mutateAsync({
      mood,
      urge,
      context: context.trim() || undefined,
      emotions: selectedEmotions,
      triggers: selectedTriggers,
    });
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card space-y-6">
        <ScaleSlider
          label="How is your mood? 🌟"
          value={mood}
          onChange={setMood}
          color="text-indigo-600"
          description="Very low/Excellent"
        />
        <ScaleSlider
          label="Urge intensity 🌊"
          value={urge}
          onChange={setUrge}
          color="text-rose-500"
          description="None/Very strong"
        />
      </div>

      <div className="card">
        <label className="block font-semibold text-slate-700 mb-2">
          What&apos;s on your mind? (optional)
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Describe your current situation, thoughts, or feelings..."
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="card">
        <p className="font-semibold text-slate-700 mb-3">How are you feeling? (select all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_EMOTIONS.map((emotion) => (
            <button
              key={emotion}
              type="button"
              onClick={() => toggleEmotion(emotion)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedEmotions.includes(emotion)
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="font-semibold text-slate-700 mb-3">What triggered this? (select all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_TRIGGERS.map((trigger) => (
            <button
              key={trigger}
              type="button"
              onClick={() => toggleTrigger(trigger)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTriggers.includes(trigger)
                  ? "bg-violet-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {trigger}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={createReflection.isPending}
        className="btn-primary w-full"
      >
        {createReflection.isPending ? "Saving..." : "Save Reflection ✓"}
      </button>
    </form>
  );
}
