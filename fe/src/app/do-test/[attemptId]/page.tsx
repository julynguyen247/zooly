"use client";

import { MOCK_Q, PARTS } from "@/utils/type";
import { Flag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TimerPill from "./components/TimerPill";
import MiniAudioPlayer from "./components/MiniAudioPlayer";
import ImageViewer from "./components/ImageViewer";
import ChoiceList from "./components/ChoiceList";
import BottomBar from "./components/BottomBar";
import PartTabs from "./components/PartTabs";
import QuestionDots from "./components/QuestionDots";

export default function ToeicExamPlayerPage() {
  const [secondsLeft, setSecondsLeft] = useState(60 * 118);
  const [flagged, setFlagged] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [currentPart, setCurrentPart] = useState(1);

  useEffect(() => {
    const id = setInterval(
      () => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, []);

  const timerLabel = useMemo(() => {
    const h = Math.floor(secondsLeft / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secondsLeft % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secondsLeft % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [secondsLeft]);

  const questionsInPart = useMemo(() => {
    const total = PARTS.find((p) => p.key === currentPart)?.total || 6;
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [currentPart]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-white flex flex-col">
      {/* Timer luôn ở top */}
      <div className="sticky top-0 z-30 w-full">
        <TimerPill label={timerLabel} />
      </div>

      {/* MAIN: card cao hơn — khoảng 75–80% màn hình */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 mt-10 md:mt-16">
          <div className="relative w-full rounded-2xl bg-white shadow-md border border-slate-100 p-6 min-h-[60vh]">
            {/* Flag */}
            <button
              className={`absolute right-4 top-4 inline-flex items-center justify-center h-9 w-9 rounded-lg border transition ${
                flagged
                  ? "bg-rose-500/10 border-rose-200 text-rose-600"
                  : "bg-rose-50 border-rose-100 text-rose-500"
              }`}
              onClick={() => setFlagged((f) => !f)}
              title="Đánh dấu xem lại"
            >
              <Flag className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-semibold mb-4 w-full">Câu hỏi 4.</h2>

            {/* Audio */}
            <div className="mb-5 w-full">
              <MiniAudioPlayer src={MOCK_Q.audio} />
            </div>

            {/* Ảnh + lựa chọn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
              <div className="w-full">
                <ImageViewer src={MOCK_Q.image} />
              </div>
              <div className="w-full">
                <ChoiceList
                  choices={MOCK_Q.choices}
                  selected={selected}
                  onChange={setSelected}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto">
        <BottomBar
          left={
            <>
              <PartTabs currentPart={currentPart} onChange={setCurrentPart} />
              <QuestionDots
                totalNumbers={questionsInPart}
                onSelect={() => {}}
              />
            </>
          }
        />
      </footer>
    </div>
  );
}
