"use client";

export default function BottomBar({ left }: { left: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 bg-white/80 backdrop-blur border-t w-full">
      <div className="mx-auto max-w-6xl w-full ">
        <div className="flex  py-6 ">
          <div className=" ">{left}</div>
        </div>
      </div>
    </div>
  );
}
