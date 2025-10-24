"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAttemptById, getTestById } from "@/utils/api";
import { Check, X, ChevronLeft } from "lucide-react";

type Answer = {
  questionId: string;
  choiceId: string | null;
  userAnswer: string | null;
  isCorrect: boolean;
  part: "listening" | "reading";
};

export default function AttemptReviewPage() {
  const router = useRouter();
  const { attemptId } = useParams<{ attemptId: string }>();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<any>(null);
  const [test, setTest] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "correct" | "wrong">("all");
  const [partFilter, setPartFilter] = useState<"all" | "listening" | "reading">(
    "all"
  );

  useEffect(() => {
    const run = async () => {
      try {
        if (!attemptId) throw new Error("Không có attemptId");
        // 1) Lấy attempt kèm answers
        const a = await getAttemptById(attemptId, true); // withAnswers=true
        setAttempt(a);

        // 2) Lấy testSetId
        const testSetId =
          a?.data.testSetId || localStorage.getItem("currentTestSetId");
        if (!testSetId) throw new Error("Không tìm thấy testSetId");

        // 3) Lấy đề (để có nội dung câu hỏi, choices)
        const t = await getTestById(testSetId);
        setTest(t.data);
      } catch (e: any) {
        console.error(e);
        alert(e?.message || "Không tải được dữ liệu review.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [attemptId]);

  const qIndex = useMemo(() => {
    const map: Record<string, any> = {};
    if (test?.questions?.length) {
      for (const q of test.questions) map[q.id] = q;
    }
    return map;
  }, [test]);

  const answers: Answer[] = attempt?.answers || [];

  const filtered = useMemo(() => {
    let arr = answers;
    if (partFilter !== "all") arr = arr.filter((a) => a.part === partFilter);
    if (filter === "correct") arr = arr.filter((a) => a.isCorrect);
    if (filter === "wrong") arr = arr.filter((a) => !a.isCorrect);
    return arr.sort((a, b) => {
      const qa = qIndex[a.questionId];
      const qb = qIndex[b.questionId];
      return (qa?.number ?? 0) - (qb?.number ?? 0);
    });
  }, [answers, filter, partFilter, qIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại
          </button>

          <div className="flex gap-2">
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={partFilter}
              onChange={(e) => setPartFilter(e.target.value as any)}
            >
              <option value="all">Tất cả phần</option>
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
            </select>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">Tất cả</option>
              <option value="correct">Đúng</option>
              <option value="wrong">Sai</option>
            </select>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Chi tiết bài làm
        </h1>

        {!filtered.length ? (
          <div className="text-slate-500 italic">
            Không có câu nào phù hợp bộ lọc.
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map((ans) => {
              const q = qIndex[ans.questionId];
              const userChoice = q?.choices?.find(
                (c: any) => c.id === ans.choiceId
              );
              const userLabel = userChoice?.label ?? ans.userAnswer ?? "—";
              const correctChoice =
                q?.choices?.find((c: any) => c.isCorrect) || null;

              return (
                <li
                  key={ans.questionId}
                  className={`rounded-xl border p-4 ${
                    ans.isCorrect
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-rose-200 bg-rose-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-slate-500">
                        {ans.part === "listening" ? "Listening" : "Reading"}
                        {typeof q?.partNo === "number"
                          ? ` • Part ${q.partNo}`
                          : ""}
                        {typeof q?.number === "number"
                          ? ` • Câu ${q.number}`
                          : ""}
                      </div>
                      <h3 className="mt-1 font-semibold text-slate-800">
                        {q?.stem ?? "—"}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      {ans.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md text-xs font-medium">
                          <Check className="w-4 h-4" /> Đúng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100 border border-rose-200 px-2 py-1 rounded-md text-xs font-medium">
                          <X className="w-4 h-4" /> Sai
                        </span>
                      )}
                    </div>
                  </div>

                  {q?.choices?.length ? (
                    <div className="mt-3 grid gap-2">
                      {q.choices.map((c: any) => {
                        const active = c.id === ans.choiceId;
                        const isRight = !!c.isCorrect;
                        return (
                          <div
                            key={c.id}
                            className={[
                              "rounded-lg border px-3 py-2 text-sm",
                              active
                                ? ans.isCorrect
                                  ? "border-emerald-300 bg-emerald-50"
                                  : "border-rose-300 bg-rose-50"
                                : "border-slate-200 bg-white",
                              isRight && !active
                                ? "ring-1 ring-emerald-200"
                                : "",
                            ].join(" ")}
                          >
                            <span className="font-semibold mr-2">
                              {c.label}.
                            </span>
                            {c.text ?? ""}
                            {isRight && (
                              <span className="ml-2 text-emerald-700 text-xs font-medium">
                                (đáp án đúng)
                              </span>
                            )}
                            {active && (
                              <span className="ml-2 text-xs text-slate-500">
                                (bạn chọn)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm">
                      Bạn chọn: <b>{userLabel}</b>
                      {!ans.isCorrect && correctChoice?.label ? (
                        <span className="ml-2">
                          • Đáp án đúng: <b>{correctChoice.label}</b>
                        </span>
                      ) : null}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
