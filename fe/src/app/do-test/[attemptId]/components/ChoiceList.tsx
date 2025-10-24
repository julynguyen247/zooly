"use client";

import { Choice } from "@/utils/type";

export default function ChoiceList({
  choices,
  selected,
  onChange,
  name = "choice",
}: {
  choices: Choice[];
  selected: string | null;
  onChange: (value: string) => void;
  name?: string;
}) {
  return (
    <div className="w-full space-y-3 text-black">
      {choices.map((c) => (
        <label
          key={c.label}
          className={`w-full flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition hover:bg-slate-50 ${
            selected === c.label
              ? "border-sky-300 ring-2 ring-sky-200"
              : "border-slate-200"
          }`}
        >
          <input
            type="radio"
            name={name}
            className="accent-sky-600 h-4 w-4"
            value={c.label}
            onChange={() => onChange(c.label)}
            checked={selected === c.label}
          />
          <span className="font-medium">({c.label})</span>
          <span className="text-slate-700">{c.text}</span>
        </label>
      ))}
    </div>
  );
}
