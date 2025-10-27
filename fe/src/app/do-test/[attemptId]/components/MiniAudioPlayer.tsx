"use client";
import { Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function fmt(second: number) {
  const m = Math.floor(second / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(second % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function MiniAudioPlayer({
  src,
  paused = false,
}: {
  src?: string;
  paused?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCur(el.currentTime || 0);
    const onLoaded = () => setDur(isFinite(el.duration) ? el.duration : 0);
    const onEnded = () => setPlaying(false);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  // auto load + play khi src đổi
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    setCur(0);
    setDur(0);
    setPlaying(false);

    if (!src) {
      el.pause();
      el.removeAttribute("src");
      el.load();
      return;
    }

    el.pause();
    el.src = src;
    el.load();

    const onCanPlay = async () => {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    el.addEventListener("canplay", onCanPlay, { once: true });
    if (el.readyState >= 3) onCanPlay();
    return () => el.removeEventListener("canplay", onCanPlay);
  }, [src]);

  // 👇 Khi paused = true thì dừng audio, false thì phát tiếp
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (paused) {
      el.pause();
      setPlaying(false);
    } else if (src) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [paused, src]);

  const pct = dur > 0 ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0;

  return (
    <div className="w-full inline-flex items-center gap-3 rounded-full bg-white/90 shadow px-4 py-2 border border-orange-100">
      <div className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-50 text-black">
        {playing ? (
          <Volume2 className="h-4 w-4 text-orange-500" />
        ) : (
          <Play className="h-4 w-4 text-slate-500" />
        )}
      </div>

      <div className="w-full max-w-xs">
        <div className="h-1.5 rounded bg-slate-200">
          <div
            className="h-1.5 rounded bg-orange-400 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          {fmt(cur)} / {fmt(dur || 0)}
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" playsInline />
    </div>
  );
}
