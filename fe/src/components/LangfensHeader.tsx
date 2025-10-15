"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import Modal from "@/components/Modal";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Khóa học",
    href: "/khoa-hoc",
    children: [
      { label: "Writing IELTS 7.0+", href: "/khoa-hoc/writing-ielts-7" },
      { label: "Reading Mastery", href: "/khoa-hoc/reading" },
    ],
  },
  { label: "Luyện đề", href: "/luyen-de", children: [] },
  { label: "Từ điển", href: "/tu-dien", children: [] },
  { label: "Từ vựng", href: "/tu-vung", children: [] },
];

export default function LangfensHeader() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<NavItem | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const googleBtnRef = useRef<HTMLButtonElement>(null);

  const onGoogleLogin = () => {
    const base = process.env.NEXT_PUBLIC_API_BASE!;
    console.log("API_BASE =", base); // kiểm tra trong console trình duyệt
    window.location.href = `${base}/api/auth/google`; // => http://localhost:3001/auth/google
  };

  return (
    <header className="w-full bg-white font-nunito">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-wide text-[#2563EB]"
          >
            LANGFENS – Master Reading, Master IELTS
          </Link>

          <button
            aria-label="Account"
            className="inline-flex size-8 items-center justify-center rounded-full border border-slate-300"
            onClick={() => setLoginOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
              <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.418 0-8 2.686-8 6v2h16v-2c0-3.314-3.582-6-8-6z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full" onMouseLeave={() => setHovered(null)}>
        <nav className="w-full bg-[#3B82F6]">
          <div className="mx-auto max-w-7xl px-3 h-10 flex items-center gap-4">
            {NAV.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setHovered(item)}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center justify-center px-4 py-[6px] text-sm sm:text-[15px] font-semibold transition-all rounded-full
                    ${
                      isActive
                        ? "bg-white text-[#2563EB] shadow-sm"
                        : "text-white/95 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {hovered && hovered.children && hovered.children.length > 0 && (
          <div className="w-full bg-white border-t">
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="flex gap-6">
                {hovered.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="text-sm text-slate-700 hover:text-[#2563EB]"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title="Đăng nhập"
        initialFocusRef={googleBtnRef}
      >
        <div className="space-y-3">
          <button
            ref={googleBtnRef}
            onClick={onGoogleLogin}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lgx-4 py-2 text-slate-800 hover:bg-slate-50 border rounded-2xl"
          >
            <svg viewBox="0 0 533.5 544.3" className="w-5 h-5" aria-hidden>
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-18.5-1.7-37-5.3-54.8H272v103.8h146.9c-6.1 33.4-25 61.6-53.3 80.5v66h86.2c50.4-46.5 81.7-115 81.7-195.5z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c72.8 0 134-24.1 178.6-65.4l-86.2-66c-23.9 16.1-54.5 25.5-92.4 25.5-70.9 0-131-47.8-152.5-112.1H30.3v70.2C74.6 486.6 167.3 544.3 272 544.3z"
              />
              <path
                fill="#fbbc04"
                d="M119.5 326.3c-10.1-30.1-10.1-62.2 0-92.3v-70.2H30.3c-43.3 86.5-43.3 186.3 0 272.8l89.2-70.3z"
              />
              <path
                fill="#ea4335"
                d="M272 107.7c39.6-.6 77.7 14 106.7 40.9l79.7-79.7C406.2 24 343.9-.1 272 0 167.3 0 74.6 57.7 30.3 175.8l89.2 70.2C141 155.7 201.1 107.7 272 107.7z"
              />
            </svg>
            <span className="font-semibold">Login with Google</span>
          </button>
        </div>
      </Modal>
    </header>
  );
}
