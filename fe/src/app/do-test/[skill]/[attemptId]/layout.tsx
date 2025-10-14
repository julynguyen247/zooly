"use client";

import QuestionNav from "./components/common/QuestionNav";
import TopBar from "./components/common/TopBar";
import PassageFooter from "./components/reading/PassageFooter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const FOOTER_H = 72;
  const QNAV_H = 56;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <TopBar />

      <div
        className="flex-1 w-full overflow-hidden"
        style={{ paddingBottom: FOOTER_H + QNAV_H + 16 }}
      >
        {children}
      </div>

      {/* QuestionNav: có nền + z-index cao hơn Footer */}
      <div
        className="fixed inset-x-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t shadow-sm"
        style={{ bottom: FOOTER_H, zIndex: 60 }} // ↑ cao hơn footer
      >
        <div className="mx-auto max-w-6xl px-4 py-3">
          <QuestionNav total={13} current={1} attemptId="" />
        </div>
      </div>

      {/* Footer phía dưới */}
      <div style={{ zIndex: 50 }}>
        <PassageFooter
          passages={[
            { id: "p1", label: "Passage 1", total: 13, done: 0 },
            { id: "p2", label: "Passage 2", total: 13, done: 0 },
            { id: "p3", label: "Passage 3", total: 14, done: 0 },
          ]}
          currentPassageId="p1"
          onChangePassage={(id) => console.log("change passage ->", id)}
          onJumpRange={(dir) => console.log("jump", dir)}
          onGridClick={() => console.log("open answer sheet")}
          rangeLabel="07–13"
          rangePrevLabel="0–0"
        />
      </div>
    </div>
  );
}
