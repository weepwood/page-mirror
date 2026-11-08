"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  TrainFront,
  Dices,
  Search,
  MessagesSquare,
  LayoutDashboard,
  ArrowUp,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const homeLinks = [
  "主页",
  "博客",
  "图片博客",
  "HeoBBS",
  "敲木鱼",
  "DNS测速",
  "轻节食",
  "DelSpace",
  "比例计",
  "摸鱼",
  "洪墨AI",
  "HeoMusic",
  "公众号",
  "图标助手",
  "Heo",
  "熊猫二憨",
  "更多我的项目",
];

const menus: { title: string; icon: string; items: string[] }[] = [
  {
    title: "文库",
    icon: "📚",
    items: ["文章归档", "标签云", "文章索引", "读书笔记"],
  },
  {
    title: "专栏",
    icon: "🎨",
    items: ["设计专栏", "开发专栏", "软件专栏", "生活专栏"],
  },
  {
    title: "友链",
    icon: "🤝",
    items: ["我的朋友", "申请友链", "博客导航"],
  },
  {
    title: "我的",
    icon: "👤",
    items: ["关于我", "我的项目", "联系方式", "赞助支持"],
  },
];

function NavButton({
  label,
  tooltip,
  onClick,
  children,
}: {
  label: string;
  tooltip: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-tooltip={tooltip}
      onClick={onClick}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--heo-fontcolor)] transition-all duration-300 hover:bg-[var(--heo-secondbg)] hover:text-[var(--heo-theme)]"
    >
      {children}
      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] px-2 py-0.5 text-xs text-[var(--heo-secondtext)] opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        {tooltip}
      </span>
    </button>
  );
}

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [homeOpen, setHomeOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const randomPost = () => {
    const hash = Math.floor(Math.random() * 20) + 1;
    window.open(`/p/${hash}`, "_blank");
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 h-[60px] transition-all duration-300 ${
        scrolled
          ? "bg-[color:var(--heo-background)]/85 shadow-[var(--heo-shadow-nav)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        id="nav"
        className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-3"
      >
        {/* 左侧：logo + 菜单 */}
        <div className="flex items-center gap-1">
          <div
            className="relative mr-1 flex cursor-pointer items-center gap-2"
            onMouseEnter={() => setHomeOpen(true)}
            onMouseLeave={() => setHomeOpen(false)}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ background: "var(--heo-logo-color)" }}
            >
              H
            </span>
            <span className="hidden text-lg font-bold md:block">张洪Heo</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${homeOpen ? "rotate-180" : ""}`}
            />
            {/* 主页下拉 */}
            {homeOpen && (
              <div className="absolute left-0 top-[46px] z-50 w-56 rounded-xl border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] p-2 shadow-xl">
                <div className="grid grid-cols-2 gap-1">
                  {homeLinks.map((l) => (
                    <Link
                      key={l}
                      href="/"
                      className="rounded-lg px-2 py-1 text-sm text-[var(--heo-secondtext)] transition-colors hover:bg-[var(--heo-secondbg)] hover:text-[var(--heo-theme)]"
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 桌面菜单 */}
          <div className="hidden items-center lg:flex">
            {menus.map((m) => (
              <div key={m.title} className="relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openMenu === m.title}
                  onClick={() =>
                    setOpenMenu(openMenu === m.title ? null : m.title)
                  }
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[15px] text-[var(--heo-fontcolor)] transition-colors hover:bg-[var(--heo-secondbg)] hover:text-[var(--heo-theme)]"
                >
                  <span className="mr-1 text-base">{m.icon}</span>
                  {m.title}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${openMenu === m.title ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenu === m.title && (
                  <div className="absolute left-0 top-[44px] z-50 w-40 rounded-xl border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] p-2 shadow-xl">
                    {m.items.map((it) => (
                      <Link
                        key={it}
                        href="/"
                        className="block rounded-lg px-3 py-1.5 text-sm text-[var(--heo-secondtext)] transition-colors hover:bg-[var(--heo-secondbg)] hover:text-[var(--heo-theme)]"
                      >
                        {it}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧按钮组 */}
        <div className="flex items-center gap-0.5">
          <NavButton label="开往" tooltip="开往-Travelling">
            <TrainFront size={18} />
          </NavButton>
          <NavButton label="随机文章" tooltip="随机文章" onClick={randomPost}>
            <Dices size={18} />
          </NavButton>
          <NavButton label="搜索" tooltip="站内搜索">
            <Search size={18} />
          </NavButton>
          <NavButton label="AI对话" tooltip="AI智能对话">
            <MessagesSquare size={18} />
          </NavButton>
          <NavButton label="中控台" tooltip="中控台">
            <LayoutDashboard size={18} />
          </NavButton>
          <NavButton label="返回顶部" tooltip="返回顶部" onClick={scrollTop}>
            <ArrowUp size={18} />
          </NavButton>
          <button
            type="button"
            aria-label="切换深色模式"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--heo-fontcolor)] transition-all duration-300 hover:bg-[var(--heo-secondbg)] hover:text-[var(--heo-theme)]"
          >
            {resolvedTheme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
          {/* 移动端汉堡 */}
          <button
            type="button"
            aria-label="菜单"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-[60px] z-50 mx-3 rounded-xl border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] p-3 shadow-xl lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {menus.flatMap((m) =>
              m.items.map((it) => (
                <Link
                  key={m.title + it}
                  href="/"
                  className="rounded-lg px-3 py-2 text-sm text-[var(--heo-secondtext)] transition-colors hover:bg-[var(--heo-secondbg)] hover:text-[var(--heo-theme)]"
                >
                  {it}
                </Link>
              )),
            )}
          </div>
        </div>
      )}
    </header>
  );
}
