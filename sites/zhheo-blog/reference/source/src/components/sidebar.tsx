import Link from "next/link";
import { ChevronDown, MessageCircle, Heart } from "lucide-react";
import { recentComments, tagCloud, archives, asset } from "@/data/posts";

/* ---------- 作者卡 ---------- */
function AuthorCard() {
  return (
    <div className="heo-card p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={asset("/img/avatar.webp")}
            alt="张洪Heo"
            width={64}
            height={64}
            className="rounded-full border-2 border-[var(--heo-theme-op-deep)]"
          />
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold">张洪Heo</div>
          <div className="heo-secondtext truncate text-xs">
            分享设计与科技生活
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--heo-theme)] py-1.5 text-sm text-white transition-all duration-300 hover:opacity-85"
        >
          <Heart size={14} /> 关注
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg bg-[var(--heo-card-btn-bg)] py-1.5 text-sm text-[var(--heo-secondtext)] transition-all duration-300 hover:text-[var(--heo-theme)]"
        >
          联系我
        </button>
      </div>
    </div>
  );
}

/* ---------- 微信卡 ---------- */
function WechatCard() {
  return (
    <div className="heo-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        微信公众号
      </div>
      <div className="rounded-lg bg-[var(--heo-secondbg)] p-3 text-center">
        <div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-lg border border-dashed border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] text-2xl">
          🌱
        </div>
        <div className="heo-secondtext text-xs">扫码关注 · 获取最新文章推送</div>
      </div>
    </div>
  );
}

/* ---------- 互动卡（最近评论） ---------- */
function CommentCard() {
  return (
    <div className="heo-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        <MessageCircle size={15} className="text-[var(--heo-theme)]" />
        互动
        <span className="heo-secondtext text-xs font-normal">最近评论</span>
      </div>
      <div className="flex flex-col gap-2">
        {recentComments.map((c) => (
          <div
            key={c.name}
            className="rounded-lg bg-[var(--heo-secondbg)] px-3 py-1.5 text-xs transition-colors hover:bg-[var(--heo-theme-op)]"
          >
            <span className="font-medium text-[var(--heo-theme)]">{c.name}</span>
            <span className="heo-secondtext ml-2">{c.text}</span>
            <span className="heo-secondtext float-right opacity-60">{c.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 标签云 ---------- */
function TagCloudCard() {
  return (
    <div className="heo-card p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        标签
        <ChevronDown size={14} className="heo-secondtext" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tagCloud.map((t) => (
          <Link
            key={t}
            href="/"
            className="rounded-md bg-[var(--heo-secondbg)] px-2 py-0.5 text-xs text-[var(--heo-secondtext)] transition-all duration-300 hover:bg-[var(--heo-theme)] hover:text-white"
          >
            {t}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- 归档 ---------- */
function ArchiveCard() {
  return (
    <div className="heo-card p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        归档
        <ChevronDown size={14} className="heo-secondtext" />
      </div>
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-sm text-[var(--heo-secondtext)] transition-colors hover:text-[var(--heo-theme)]">
          全部年份
          <ChevronDown
            size={14}
            className="transition-transform duration-300 group-open:rotate-180"
          />
        </summary>
        <div className="mt-1 flex flex-col gap-1 pl-1">
          {archives.map((a) => (
            <Link
              key={a.year}
              href="/"
              className="flex items-center justify-between rounded-md px-2 py-0.5 text-[13px] text-[var(--heo-secondtext)] transition-colors hover:bg-[var(--heo-secondbg)] hover:text-[var(--heo-theme)]"
            >
              <span>{a.year}</span>
              <span className="text-xs opacity-70">{a.count} 篇</span>
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-3 lg:w-[300px] lg:shrink-0">
      <AuthorCard />
      <WechatCard />
      <CommentCard />
      <div className="flex flex-col gap-3 lg:sticky lg:top-[72px]">
        <TagCloudCard />
        <ArchiveCard />
      </div>
    </aside>
  );
}
