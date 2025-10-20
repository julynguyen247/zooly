"use client";
import { Pause, Play, Volume2 } from "lucide-react";
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

export default function MiniAudioPlayer({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCur(el.currentTime);
    const onLoaded = () => setDur(el.duration || 0);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && src) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
      setPlaying(true);
    }
  }, [src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  };

  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div className="w-full inline-flex items-center gap-3 rounded-full bg-white/90 shadow px-4 py-2 border border-orange-100">
      <button
        onClick={toggle}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-50 hover:bg-orange-100 transition"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <div className="w-full max-w-xs">
        <div className="h-1.5 rounded bg-slate-200">
          <div
            className="h-1.5 rounded bg-orange-400"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          {fmt(cur)} / {fmt(dur || 0)}
        </div>
      </div>
      <Volume2 className="h-4 w-4 text-slate-600" />
      <audio ref={audioRef} preload="metadata">
        {src && <source src={src} />}
      </audio>
    </div>
  );
}
