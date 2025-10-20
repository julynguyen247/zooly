"use client";

export default function QuestionDots({
  totalNumbers,
  onSelect,
}: {
  totalNumbers: number[];
  onSelect?: (n: number) => void;
}) {
  return (
    <div className="w-full mt-4 flex flex-wrap gap-2">
      {totalNumbers.slice(0, 12).map((n) => (
        <button
          key={n}
          className="h-9 w-9 rounded-full border bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
          title={`Câu ${n}`}
          onClick={() => onSelect?.(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
