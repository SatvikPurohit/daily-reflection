import { ReflectionForm } from "@/components/reflect/ReflectionForm";

export default function ReflectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">New Reflection</h1>
        <p className="text-slate-500 mt-1">
          Take a moment to check in with yourself
        </p>
      </div>
      <ReflectionForm />
    </div>
  );
}
