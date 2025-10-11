"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { downChevron } from "./utils/icons";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "facebook" | null
  >(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background,#fff)] text-[var(--foreground,#171717)] font-nunito">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between ">
          <div className="flex gap-8 items-center justify-center ">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#317EFF]" />
              <span className="text-lg font-bold tracking-wide">LANGFENS</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm ">
              <a
                className="hover:text-blue-600 font-semibold flex items-center gap-1 "
                href="#"
              >
                <span className="mb-1">Khóa học</span> {downChevron}
              </a>
              <a
                className="hover:text-blue-600 font-semibold flex items-center gap-1 "
                href="#"
              >
                <span className="mb-1">Kiểm tra đầu vào </span>
                {downChevron}
              </a>
              <a
                className="hover:text-blue-600 font-semibold flex items-center gap-1 "
                href="#"
              >
                <span className="mb-1">Luyện đề</span> {downChevron}
              </a>
              <a
                className="hover:text-blue-600 font-semibold flex items-center gap-1"
                href="#"
              >
                <span className="mb-1">Blog</span> {downChevron}
              </a>
            </nav>
          </div>

          <Button
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
            onClickFunc={() => setOpen(true)}
          >
            Bắt đầu
          </Button>
        </div>
      </header>
    </div>
  );
}
