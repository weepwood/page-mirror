"use client";

import { useState } from "react";
import { fixedCategories, blogCategories, type CategoryItem } from "@/data/posts";
import { asset } from "@/data/posts";

function CategoryItemView({
  item,
  active,
  onClick,
}: {
  item: CategoryItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all duration-300 ${
        active
          ? "border-[var(--heo-theme)] text-[var(--heo-theme)] shadow-[var(--heo-shadow-theme)]"
          : "border-[var(--heo-card-border)] bg-[var(--heo-card-bg)] text-[var(--heo-secondtext)] hover:text-[var(--heo-theme)]"
      }`}
    >
      {item.icon && (
        <span
          className="h-5 w-5 shrink-0 rounded-md bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${asset(item.icon)}')`, backgroundColor: item.color ?? "transparent", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        />
      )}
      <span className="whitespace-nowrap">{item.name}</span>
      {typeof item.count === "number" && (
        <span className="text-xs opacity-70">{item.count}</span>
      )}
    </button>
  );
}

export function CategoryBar() {
  const [active, setActive] = useState("全部文章");

  return (
    <div className="mb-4 mt-16 lg:mt-20">
      <div className="heo-scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {fixedCategories.map((c) => (
          <CategoryItemView
            key={c.name}
            item={c}
            active={active === c.name}
            onClick={() => setActive(c.name)}
          />
        ))}
        {blogCategories.map((c) => (
          <CategoryItemView
            key={c.name}
            item={c}
            active={active === c.name}
            onClick={() => setActive(c.name)}
          />
        ))}
      </div>
    </div>
  );
}
