import { posts } from "@/data/posts";
import { PostCard } from "@/components/post-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PostList() {
  return (
    <div id="recent-posts" className="flex flex-col gap-[10px]">
      <div className="grid grid-cols-1 gap-[10px] xl:grid-cols-2">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      {/* 分页 */}
      <nav
        aria-label="分页"
        className="mt-4 flex items-center justify-center gap-2"
      >
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] text-[var(--heo-secondtext)] transition-all duration-300 hover:border-[var(--heo-theme)] hover:text-[var(--heo-theme)]"
          aria-label="上一页"
        >
          <ChevronLeft size={16} />
        </button>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-all duration-300 ${
              n === 1
                ? "border-[var(--heo-theme)] bg-[var(--heo-theme)] text-white"
                : "border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] text-[var(--heo-secondtext)] hover:border-[var(--heo-theme)] hover:text-[var(--heo-theme)]"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] text-[var(--heo-secondtext)] transition-all duration-300 hover:border-[var(--heo-theme)] hover:text-[var(--heo-theme)]"
          aria-label="下一页"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
