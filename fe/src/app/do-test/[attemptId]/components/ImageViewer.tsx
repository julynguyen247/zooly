"use client";
import Image from "next/image";
import { Eye, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

export default function ImageViewer({
  src,
  alt = "question",
}: {
  src?: string;
  alt?: string;
}) {
  const [scale, setScale] = useState(1);

  if (!src) {
    return (
      <div className="w-full text-sm text-slate-500 flex items-center gap-4">
        <span className="inline-flex items-center gap-1">
          <Eye className="h-4 w-4" />
          Xem
        </span>
        <span className="inline-flex items-center gap-1">
          <ZoomIn className="h-4 w-4" />
          Phóng to
        </span>
        <span className="inline-flex items-center gap-1">
          <ZoomOut className="h-4 w-4" />
          Thu nhỏ
        </span>
      </div>
    );
  }

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 1));

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-xl border bg-slate-50">
        <div
          className="origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          {/* <Image
            src={src}
            alt={alt}
            width={1200}
            height={720}
            className="w-full h-72 object-cover"
            priority
          /> */}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-slate-500">
        <button
          className="inline-flex items-center gap-1 text-sm"
          onClick={zoomIn}
        >
          <ZoomIn className="h-4 w-4" />
          Phóng to
        </button>
        <button
          className="inline-flex items-center gap-1 text-sm"
          onClick={zoomOut}
        >
          <ZoomOut className="h-4 w-4" />
          Thu nhỏ
        </button>
      </div>
    </div>
  );
}
