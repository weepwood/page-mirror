"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="返回顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] text-[var(--heo-secondtext)] shadow-[var(--heo-shadow-border)] transition-all duration-300 hover:border-[var(--heo-theme)] hover:text-[var(--heo-theme)] hover:shadow-[var(--heo-shadow-theme)]"
    >
      <ArrowUp size={18} />
    </button>
  );
}
