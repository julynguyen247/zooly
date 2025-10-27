"use client";
import { useEffect, useState, useCallback } from "react";
import { Timer, PauseCircle, PlayCircle } from "lucide-react";

export default function TimerPill({
  duration,
  onPause,
  onSubmit,
  onResume,
}: {
  duration: number;
  onPause?: () => void;
  onSubmit?: () => void;
  onResume?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [paused, setPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (timeLeft <= 0) {
      onSubmit?.();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, paused, onSubmit]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePause = () => {
    setPaused(true);
    setShowPauseModal(true);
    onPause?.();
  };

  const handleResume = () => {
    setShowPauseModal(false);
    setPaused(false);
    onResume?.();
  };

  return (
    <>
      <div className="relative w-full flex items-center justify-center pt-3 px-4 sm:px-6 lg:px-8">
        <div className="absolute right-4 flex items-center gap-3">
          {paused ? (
            <button
              onClick={handleResume}
              className="h-9 sm:h-10 px-4 rounded-lg border text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium inline-flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              Tiếp tục
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="h-9 sm:h-10 px-4 rounded-lg border text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium inline-flex items-center gap-2"
            >
              <PauseCircle className="h-4 w-4" />
              Tạm dừng
            </button>
          )}
          <button
            onClick={onSubmit}
            className="h-9 sm:h-10 px-5 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow text-sm"
          >
            Nộp bài
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white shadow px-4 py-1.5 border border-slate-100">
          <Timer className="h-4 w-4 text-sky-600" />
          <span
            className={`font-semibold ${
              paused ? "text-rose-600" : "text-sky-700"
            }`}
          >
            {formatTime(timeLeft)}
            {paused ? " — TẠM DỪNG" : ""}
          </span>
        </div>
      </div>
      {showPauseModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
              <div className="flex items-start gap-3">
                <PauseCircle className="h-6 w-6 text-rose-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Bài làm đang tạm dừng
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Thời gian đếm ngược đã <strong>dừng lại</strong>. Khi bạn
                    sẵn sàng, bấm <strong>Tiếp tục</strong> để tiếp tục làm bài.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Thời gian còn lại:{" "}
                    <span className="font-semibold">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={handleResume}
                  className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-white font-semibold shadow hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Tiếp tục làm bài
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
