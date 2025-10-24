"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAttemptById } from "@/utils/api";
import { Trophy, BookOpen, Headphones, ArrowLeft } from "lucide-react";

export default function AttemptResultPage() {
  const router = useRouter();
  const { attemptId } = useParams<{ attemptId: string }>();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!attemptId) throw new Error("Không tìm thấy attemptId!");
        const res = await getAttemptById(attemptId, false);
        setAttempt(res);
      } catch (err: any) {
        console.error("Lỗi khi lấy kết quả:", err);
        alert(err.message || "Không thể tải kết quả bài làm!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [attemptId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full" />
      </div>
    );

  if (!attempt)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Không tìm thấy dữ liệu bài làm.</p>
        <button
          onClick={() => router.push("/home")}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    );

  const {
    scaledListening,
    scaledReading,
    total,
    rawListening,
    rawReading,
    submittedAt,
  } = attempt;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl border border-slate-100 rounded-3xl p-8 relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex items-center text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </button>

        <div className="flex flex-col items-center mb-6">
          <Trophy className="w-14 h-14 text-yellow-500" />
          <h1 className="text-2xl font-bold mt-3 text-slate-800">
            Kết quả bài thi TOEIC
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {submittedAt
              ? `Nộp lúc: ${new Date(submittedAt).toLocaleString("vi-VN")}`
              : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center border border-slate-100 rounded-xl p-4 bg-blue-50">
            <Headphones className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800 mt-1">
              Listening
            </h2>
            <p className="text-3xl font-bold text-blue-700 mt-1">
              {scaledListening ?? "--"}
            </p>
            <span className="text-sm text-slate-500">
              {rawListening} câu đúng
            </span>
          </div>

          <div className="flex flex-col items-center border border-slate-100 rounded-xl p-4 bg-pink-50">
            <BookOpen className="w-6 h-6 text-pink-600" />
            <h2 className="text-lg font-semibold text-slate-800 mt-1">
              Reading
            </h2>
            <p className="text-3xl font-bold text-pink-700 mt-1">
              {scaledReading ?? "--"}
            </p>
            <span className="text-sm text-slate-500">
              {rawReading} câu đúng
            </span>
          </div>

          <div className="flex flex-col items-center border border-slate-100 rounded-xl p-4 bg-yellow-50">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h2 className="text-lg font-semibold text-slate-800 mt-1">
              Tổng điểm
            </h2>
            <p className="text-4xl font-extrabold text-yellow-600 mt-1">
              {total ?? "--"}
            </p>
            <span className="text-sm text-slate-500">/ 990 điểm</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/home")}
            className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => router.push(`/do-test/${attemptId}/review`)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Xem chi tiết bài làm
          </button>
        </div>
      </div>
    </div>
  );
}
