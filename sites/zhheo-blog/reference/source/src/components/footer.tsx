import Link from "next/link";
import {
  Mail,
  AtSign,
  CircleDot,
  Code2,
  Pin,
  Play,
  Music2,
} from "lucide-react";
import { socials, footerLinks } from "@/data/posts";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  mail: Mail,
  weibo: AtSign,
  twitter: AtSign,
  dribbble: CircleDot,
  github: Code2,
  pinterest: Pin,
  bilibili: Play,
  douyin: Music2,
};

export function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-[var(--heo-card-border)] bg-[var(--heo-card-bg)]">
      <div className="mx-auto max-w-[1400px] px-3 py-8">
        {/* 社交行 */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {socials.map((s) => {
            const Icon = iconMap[s.icon] ?? Mail;
            return (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[var(--heo-card-border)] px-3 py-1 text-sm text-[var(--heo-secondtext)] transition-all duration-300 hover:border-[var(--heo-theme)] hover:text-[var(--heo-theme)] hover:shadow-[var(--heo-shadow-theme)]"
              >
                <Icon size={14} />
                {s.name}
              </a>
            );
          })}
        </div>

        {/* 链接列 */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-8">
          {footerLinks.map((col) => (
            <div key={col.title}>
              <div className="mb-2 text-sm font-bold">{col.title}</div>
              <ul className="flex flex-col gap-1">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="/"
                      className="text-[13px] text-[var(--heo-secondtext)] transition-colors hover:text-[var(--heo-theme)]"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 版权 */}
        <div className="mt-8 border-t border-[var(--heo-card-border)] pt-4 text-center text-xs leading-6 text-[var(--heo-secondtext)]">
          <div>
            ©2019-2026 By{" "}
            <Link href="/" className="text-[var(--heo-theme)]">
              张洪Heo
            </Link>
            {" · "}本站已运行 2456 天
          </div>
          <div className="opacity-70">
            本站由 Next.js 驱动 · 主题灵感来自 Heo ·{" "}
            <span className="cursor-pointer hover:text-[var(--heo-theme)]">
              蜀ICP备19030858号-2
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
