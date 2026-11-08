import { CategoryBar } from "@/components/category-bar";
import { PostList } from "@/components/post-list";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <CategoryBar />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <PostList />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
