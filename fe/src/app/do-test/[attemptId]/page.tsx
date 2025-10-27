"use client";

import {
  MOCK_Q,
  READING_PARTS,
  LISTENING_PARTS,
  FULL_TEST,
} from "@/utils/type";
import { Flag } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import TimerPill from "./components/TimerPill";
import MiniAudioPlayer from "./components/MiniAudioPlayer";
import ImageViewer from "./components/ImageViewer";
import ChoiceList from "./components/ChoiceList";
import BottomBar from "./components/BottomBar";
import PartTabs from "./components/PartTabs";
import QuestionDots from "./components/QuestionDots";
import { getTestById } from "@/utils/api";

import { submitAttempt, upsertAnswer } from "@/utils/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function ToeicExamPlayerPage() {
  const router = useRouter();
  const params = useParams<{ attemptId?: string }>();
  const attemptId = (params?.attemptId as string) || "";
  const searchParams = useSearchParams();

  const [currentPart, setCurrentPart] = useState(1);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswer] = useState<any>({});
  const [flags, setFlags] = useState<any>({});
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [check, setCheck] = useState("");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const testSetId = localStorage.getItem("currentTestSetId");
        if (!testSetId) throw new Error("Không tìm thấy testSetId!");
        const res = await getTestById(testSetId);
        if (res.data.durationSeconds === 2700) {
          setCheck("listening");
        } else if (res.data.durationSeconds === 4500) {
          setCheck("reading");
        } else {
          setCheck("full");
        }
        setTest(res.data);
      } catch (err: any) {
        console.error("Lỗi khi lấy đề:", err);
        alert(err.message || "Không tải được đề thi!");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [searchParams]);

  useEffect(() => {
    if (test && test.questions?.length > 0) {
      const firstPart = Object.keys(
        test.questions.reduce((acc: any, q: any) => {
          const part = q.partNo;
          if (!acc[part]) acc[part] = [];
          acc[part].push(q);
          return acc;
        }, {})
      )[0];
      setCurrentPart(Number(firstPart));
      setCurrentIndex(0);
    }
  }, [test]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentPart]);

  useEffect(() => {
    if (!started) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter") setStarted(true);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [started]);

  const byPart = useMemo(() => {
    if (!test?.questions) return {};
    return test.questions.reduce((acc: Record<number, any[]>, q: any) => {
      (acc[q.partNo] ??= []).push(q);
      return acc;
    }, {});
  }, [test]);

  const currentList = byPart[currentPart] ?? [];
  const totalInPart = currentList.length;
  const currentQuestion = currentList[currentIndex];

  const selected = currentQuestion ? answers[currentQuestion.id] : null;
  const flagged = currentQuestion ? !!flags[currentQuestion.id] : false;

  const handleSelect = (label: string) => {
    if (!currentQuestion) return;
    setAnswer((prev: any) => ({ ...prev, [currentQuestion.id]: label }));
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlags((prev: any) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };
  const goNext = () => {
    if (currentIndex < totalInPart - 1) setCurrentIndex((i) => i + 1);
  };

  const handleSelectDot = (n: number) => setCurrentIndex(n - 1);

  const duration = test?.durationSeconds;

  const handleSubmitFromPage = useCallback(async () => {
    try {
      if (!attemptId) {
        alert("Không tìm thấy attemptId để nộp bài!");
        return;
      }
      const list = Object.entries(answers);
      if (test?.questions?.length && list.length) {
        const qIndex: Record<string, any> = {};
        for (const q of test.questions) qIndex[q.id] = q;

        await Promise.all(
          list.map(async ([qid, label]) => {
            const q = qIndex[qid as string];
            if (!q) return;
            await upsertAnswer(attemptId, {
              questionId: qid as string,
              choiceId:
                q.choices?.find((c: any) => c.label === label)?.id ?? null,
              userAnswer: null,
              part: q.partNo <= 4 ? "listening" : "reading",
            });
          })
        );
      }
      const res = await submitAttempt(attemptId);
      router.replace(`/do-test/${res.data.attemptId}/result`);
    } catch (e: any) {
      alert(e?.message || "Nộp bài thất bại. Thử lại nhé!");
    }
  }, [answers, attemptId, test, router]);

  const totalNumbers = useMemo(() => {
    let total = 6;

    if (check === "reading") {
      total = READING_PARTS.find((p) => p.key === currentPart)?.total ?? 6;
    } else if (check === "listening") {
      total = LISTENING_PARTS.find((p) => p.key === currentPart)?.total ?? 6;
    } else {
      total = FULL_TEST.find((p) => p.key === currentPart)?.total ?? 6;
    }

    return Array.from({ length: total }, (_, i) => i + 1);
  }, [check, currentPart]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-white flex flex-col">
      <div className="sticky top-0 z-30 w-full">
        {started && duration ? (
          <TimerPill
            duration={duration}
            onSubmit={handleSubmitFromPage}
            onPause={() => setPaused(true)}
            onResume={() => setPaused(false)}
          />
        ) : null}
      </div>

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 mt-10 md:mt-16">
          <div
            className={`relative w-full rounded-2xl bg-white shadow-md border border-slate-100 p-6 min-h-[60vh] ${
              !started ? "pointer-events-none select-none opacity-60" : ""
            }`}
          >
            <button
              onClick={toggleFlag}
              className={`absolute right-4 top-4 inline-flex items-center justify-center h-9 w-9 rounded-lg border transition ${
                flagged
                  ? "bg-rose-500/10 border-rose-200 text-rose-600"
                  : "bg-rose-50 border-rose-100 text-rose-500"
              }`}
              title="Đánh dấu xem lại"
            >
              <Flag className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-semibold mb-4 w-full text-black">
              {currentQuestion ? `Câu ${currentQuestion.number}.` : "—"}
            </h2>
            <h3 className="text-lg font-semibold w-full text-black mt-3">
              {currentQuestion?.stem ?? ""}
            </h3>

            <div className="flex items-start md:items-center justify-center gap-8 w-full mt-6 md:mt-10 flex-col md:flex-row">
              <div className="w-full">
                {currentQuestion?.partNo <= 4 && currentQuestion.audioKey && (
                  <div className="mb-4">
                    <MiniAudioPlayer
                      src={currentQuestion.audioKey}
                      paused={paused}
                    />
                  </div>
                )}
                {currentQuestion?.imageKey && (
                  <ImageViewer src={currentQuestion.imageKey} />
                )}
              </div>

              <div className="w-full">
                {currentQuestion ? (
                  <ChoiceList
                    choices={currentQuestion.choices}
                    selected={selected}
                    onChange={handleSelect}
                  />
                ) : (
                  <div className="text-slate-500 italic">
                    Chưa có câu hỏi cho phần này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto">
        <BottomBar
          left={
            <>
              <PartTabs
                currentPart={currentPart}
                onChange={(p) => setCurrentPart(p)}
              />
              <QuestionDots
                totalNumbers={totalNumbers}
                onSelect={(n) => handleSelectDot(n)}
              />
            </>
          }
        />
      </footer>

      {!started && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-[92%] max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900">
              Bắt đầu làm bài TOEIC
            </h3>
            <p className="mt-2 text-slate-600">
              Khi bạn bấm <strong>Bắt đầu làm bài</strong>, thời gian sẽ tính
              ngay. Hãy chuẩn bị tinh thần và không gian yên tĩnh nhé.
            </p>

            <ul className="mt-4 text-slate-700 text-sm list-disc pl-5 space-y-1">
              <li>
                Thời lượng:{" "}
                <span className="font-medium">
                  {duration ? Math.round(duration / 60) : "--"} phút
                </span>
              </li>
              <li>Không đóng trang trong khi làm.</li>
              <li>Có thể đánh dấu câu để xem lại.</li>
              <li>Nhấn Enter để bắt đầu nhanh.</li>
            </ul>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setStarted(true)}
                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-white font-semibold shadow hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Bắt đầu làm bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
