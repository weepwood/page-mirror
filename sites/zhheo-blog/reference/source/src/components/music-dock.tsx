"use client";

import { useState } from "react";
import { Play, Pause, ListMusic, X } from "lucide-react";
import { asset } from "@/data/posts";

const playlist = [
  { title: "草海", artist: "尤长靖", cover: "/img/music-cover.webp" },
  { title: "我们曾见过", artist: "张悬", cover: "/img/music-cover.webp" },
  { title: "起风了", artist: "买辣椒也用券", cover: "/img/music-cover.webp" },
];

export function MusicDock() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);

  const track = playlist[current];

  return (
    <div className="fixed bottom-5 right-5 z-50" style={{ width: "var(--heo-dock-width, 300px)" }}>
      {open && (
        <div className="heo-card mb-2 p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1">
              <ListMusic size={13} className="text-[var(--heo-theme)]" />
              播放列表
            </span>
            <button
              type="button"
              aria-label="关闭"
              onClick={() => setOpen(false)}
              className="text-[var(--heo-secondtext)] hover:text-[var(--heo-theme)]"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {playlist.map((t, i) => (
              <button
                key={t.title}
                type="button"
                onClick={() => {
                  setCurrent(i);
                  setPlaying(true);
                }}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs transition-colors ${
                  i === current
                    ? "bg-[var(--heo-theme-op)] text-[var(--heo-theme)]"
                    : "text-[var(--heo-secondtext)] hover:bg-[var(--heo-secondbg)]"
                }`}
              >
                <img
                  src={asset(t.cover)}
                  alt=""
                  width={22}
                  height={22}
                  className="rounded"
                />
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dock 卡片 */}
      <div
        role="button"
        tabIndex={0}
        aria-label="打开播放列表"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(!open);
        }}
        className="heo-card flex w-full cursor-pointer items-center gap-2 p-2 text-left"
      >
        <img
          src={asset(track.cover)}
          alt={track.title}
          width={36}
          height={36}
          className="rounded-md"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium">{track.title}</div>
          <div className="heo-secondtext truncate text-[10px]">{track.artist}</div>
        </div>
        <button
          type="button"
          aria-label={playing ? "暂停" : "播放"}
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(!playing);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--heo-theme)] text-white transition-opacity hover:opacity-85"
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    </div>
  );
}
