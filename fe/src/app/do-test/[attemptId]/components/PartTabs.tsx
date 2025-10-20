"use client";
import { PARTS } from "@/utils/type";
import { ChevronDown } from "lucide-react";

export default function PartTabs({
  currentPart,
  onChange,
}: {
  currentPart: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="w-full flex gap-4 ">
      {PARTS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`min-w-[160px] rounded-xl border px-4 py-3 text-left shadow-sm transition relative ${
            currentPart === p.key
              ? "border-sky-300 bg-sky-50"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div
            className={`text-sm font-semibold ${
              currentPart === p.key ? "text-sky-700" : "text-slate-800"
            }`}
          >
            {p.title}
          </div>
          <div className="text-xs text-slate-500">0/{p.total} questions</div>
          {currentPart === p.key && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-white border shadow flex items-center justify-center">
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
