import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { Post } from "@/data/posts";
import { asset } from "@/data/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] shadow-[var(--heo-shadow-border)] transition-all duration-300 hover:border-[var(--heo-theme)] hover:shadow-[var(--heo-shadow-theme)] md:flex-row xl:flex-col"
      style={{ clipPath: "inset(0 0 0 0 round 12px)" }}
    >
      {/* 封面：<md 竖向 170px / md-xl 横向 40%×220 / xl 竖向 210px */}
      <Link
        href={`/p/${post.id + 1}`}
        className="relative block h-[170px] w-full shrink-0 overflow-hidden md:h-[220px] md:w-[40%] xl:h-[210px] xl:w-full"
        aria-label={post.title}
      >
        <img
          src={asset(post.cover)}
          alt={post.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      {/* 信息区 */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4 md:p-[16px_18px] xl:p-[18px_32px]">
        <div>
          {/* 徽章行 */}
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="heo-badge bg-[var(--heo-theme-op)] font-medium text-[var(--heo-theme)]">
              {post.category}
            </span>
            {post.isLatest && (
              <span
                className="heo-badge font-medium text-white"
                style={{ background: "linear-gradient(215deg,#4584ff,#cf0db9)" }}
              >
                最新
              </span>
            )}
            {post.isUnread && (
              <span className="heo-badge bg-[var(--heo-card-btn-bg)] text-[var(--heo-secondtext)]">
                未读
              </span>
            )}
          </div>

          {/* 标题 */}
          <h2 className="my-1 line-clamp-2 text-[17px] font-bold leading-[26px] text-[var(--heo-fontcolor)] transition-colors duration-300 group-hover:text-[var(--heo-theme)] md:text-[18px] md:leading-[28px] xl:text-[20px] xl:leading-[30px]">
            <Link href={`/p/${post.id + 1}`}>{post.title}</Link>
          </h2>
        </div>

        {/* meta 行 */}
        <div className="mt-2 flex items-center gap-1.5 text-[12px] leading-6 text-[var(--heo-secondtext)]">
          <span className="opacity-80">|</span>
          <span className="text-[var(--heo-theme)]">{post.tags[0] ?? "随笔"}</span>
          {post.tags.slice(1).map((t) => (
            <span key={t}>
              <span className="opacity-50">•</span>
              <Link
                href="/"
                className="ml-1.5 transition-colors hover:text-[var(--heo-theme)]"
              >
                {t}
              </Link>
            </span>
          ))}
          <span className="ml-auto flex items-center gap-1">
            <CalendarDays size={13} />
            {post.date}
          </span>
        </div>
      </div>
    </article>
  );
}
