// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/api"; // hoặc đường dẫn nơi bạn export getUser

type Skill = "listening" | "reading";

type TestItem = {
  id: string;
  title: string;
  part: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  skill: Skill;
  durationMin: number;
  questionsHint?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
};

type User = {
  id: string;
  email: string;
  displayName?: string;
  first_name?: string;
  last_name?: string;
  // bổ sung field khác nếu BE trả về
};

const listeningTests: TestItem[] = [
  {
    id: "L-P1-001",
    title: "TOEIC Listening — Part 1 (Photos) – Mini",
    part: 1,
    skill: "listening",
    durationMin: 8,
    questionsHint: "6 ảnh",
    level: "Beginner",
  },
  {
    id: "L-P3-002",
    title: "TOEIC Listening — Part 3 (Conversations) – Mini",
    part: 3,
    skill: "listening",
    durationMin: 20,
    questionsHint: "25 câu",
    level: "Intermediate",
  },
  {
    id: "L-FULL-003",
    title: "TOEIC Listening — Full Test (Part 1–4)",
    part: 4,
    skill: "listening",
    durationMin: 45,
    questionsHint: "100 câu",
    level: "Advanced",
  },
];

const readingTests: TestItem[] = [
  {
    id: "R-P5-001",
    title: "TOEIC Reading — Part 5 (Incomplete Sentences) – Mini",
    part: 5,
    skill: "reading",
    durationMin: 15,
    questionsHint: "30 câu",
    level: "Beginner",
  },
  {
    id: "R-P6-002",
    title: "TOEIC Reading — Part 6 (Text Completion) – Mini",
    part: 6,
    skill: "reading",
    durationMin: 20,
    questionsHint: "16 câu",
    level: "Intermediate",
  },
  {
    id: "R-FULL-003",
    title: "TOEIC Reading — Full Test (Part 5–7)",
    part: 7,
    skill: "reading",
    durationMin: 75,
    questionsHint: "100 câu",
    level: "Advanced",
  },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getUser();
        console.log(me);
        if (mounted) setUser(me);
      } catch (e) {
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(40%_60%_at_80%_10%,#fef9c3_0%,transparent_50%),radial-gradient(30%_40%_at_10%_20%,#bbf7d0_0%,transparent_45%),#F3F4F6]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
            Chọn bài test TOEIC
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-12">
        <Section
          title="Listening (Part 1–4)"
          description="Nghe mô tả ảnh, hỏi–đáp, hội thoại, bài nói. Hỗ trợ audio player + điều hướng câu hỏi."
          accent="blue"
          tests={listeningTests}
        />
        <Section
          title="Reading (Part 5–7)"
          description="Hoàn thành câu, hoàn thành đoạn văn, đọc hiểu đơn/đa đoạn. Có thanh điều hướng câu hỏi."
          accent="emerald"
          tests={readingTests}
        />
      </main>

      <footer className="border-t bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Langfens. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  description,
  accent,
  tests,
}: {
  title: string;
  description: string;
  accent: "blue" | "emerald" | "amber";
  tests: TestItem[];
}) {
  const accentRing =
    accent === "blue"
      ? "group-hover:ring-blue-300/60"
      : accent === "emerald"
      ? "group-hover:ring-emerald-300/60"
      : "group-hover:ring-amber-300/60";

  const accentBg =
    accent === "blue"
      ? "bg-gradient-to-br from-blue-50 to-white"
      : accent === "emerald"
      ? "bg-gradient-to-br from-emerald-50 to-white"
      : "bg-gradient-to-br from-amber-50 to-white";

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((t) => (
          <div
            key={t.id}
            className={`group relative rounded-2xl ${accentBg} border border-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div
              className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 transition-all duration-300 ${accentRing}`}
            />
            <TestCard test={t} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TestCard({ test }: { test: TestItem }) {
  const attemptId = test.id;

  const levelStyle =
    test.level === "Beginner"
      ? "bg-white text-slate-700 border border-slate-200"
      : test.level === "Intermediate"
      ? "bg-white text-sky-700 border border-sky-200"
      : test.level === "Advanced"
      ? "bg-white text-rose-700 border border-rose-200"
      : "bg-white text-slate-700 border border-slate-200";

  return (
    <div className="relative p-5">
      {/* Meta row */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${levelStyle}`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              test.level === "Beginner"
                ? "bg-slate-400"
                : test.level === "Intermediate"
                ? "bg-sky-500"
                : test.level === "Advanced"
                ? "bg-rose-500"
                : "bg-slate-400"
            }`}
          />
          {test.level ?? "Practice"}
        </span>

        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="opacity-80"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
            <path d="M12 7v5l3 2" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {test.durationMin} phút
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-[15.5px] font-semibold leading-snug text-slate-900">
        {test.title}
      </h3>

      {/* Part & questions */}
      <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
        <Badge
          icon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M4 12h16" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 4v16" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
          label={`Part ${test.part}`}
        />
        {test.questionsHint && (
          <Badge icon={QuestionIcon()} label={test.questionsHint} />
        )}
        <Badge icon={SkillIcon(test.skill)} label={capitalize(test.skill)} />
      </div>

      {/* Divider */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">ID {test.id}</span>

        <Link
          href={`/do-test/${test.skill}/${attemptId}`}
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2 text-[13.5px] font-semibold text-slate-900 shadow-sm transition-[transform,filter] hover:brightness-95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-yellow-300"
          aria-label={`Bắt đầu ${test.title}`}
        >
          Bắt đầu
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/70 px-2 py-1 text-[11px] font-medium text-slate-600 backdrop-blur">
      <span className="opacity-80">{icon}</span>
      {label}
    </span>
  );
}

function SkillIcon(skill: Skill) {
  if (skill === "listening") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M9 18V6" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 18V6" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 10v4" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M20 10v4" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M4 6h9a3 3 0 0 1 3 3v9H7a3 3 0 0 1-3-3V6z" strokeWidth="1.6" />
      <path d="M16 6h4v12h-4" strokeWidth="1.6" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M12 17h.01" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
    </svg>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
