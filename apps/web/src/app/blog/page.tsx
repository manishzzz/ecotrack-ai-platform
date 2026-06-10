import { SiteHeader } from "@/components/layout/site-header";
import { BlogList } from "@/components/blog/blog-list";

export default function BlogPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-600">Sustainability blog</p>
          <h1 className="mt-3 text-4xl font-semibold">Ideas, reporting strategies, and lower-carbon habits that actually stick.</h1>
        </div>
        <div className="mt-10">
          <BlogList />
        </div>
      </section>
    </main>
  );
}
