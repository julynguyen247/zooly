"use client";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export default function TimerPill({
  duration,
  onPause,
  onSubmit,
}: {
  duration: number;
  onPause?: () => void;
  onSubmit?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onSubmit]);
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full flex items-center justify-center pt-3 px-4 sm:px-6 lg:px-8">
      <div className="absolute right-4 flex items-center gap-3">
        <button
          onClick={onPause}
          className="h-9 sm:h-10 px-4 rounded-lg border text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium"
        >
          Tạm dừng
        </button>
        <button
          onClick={onSubmit}
          className="h-9 sm:h-10 px-5 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow text-sm"
        >
          Nộp bài
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-white shadow px-4 py-1.5 border border-slate-100">
        <Timer className="h-4 w-4 text-sky-600" />
        <span className="font-semibold text-sky-700">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}
