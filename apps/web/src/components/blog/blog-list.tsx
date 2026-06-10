"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { mockBlogs } from "@/lib/mock-data";
import type { BlogPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [status, setStatus] = useState("Loading sustainability stories...");

  useEffect(() => {
    void (async () => {
      try {
        const response = await api<BlogPost[]>("/blogs");
        if (response.length > 0) {
          setBlogs(response);
        }
        setStatus("");
      } catch {
        setStatus("Showing curated starter content while the live API is unavailable.");
      }
    })();
  }, []);

  return (
    <div className="grid gap-6">
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      {blogs.map((blog) => (
        <Card key={blog.id}>
          <div className="flex items-center gap-3">
            <Badge>Blog</Badge>
            <span className="text-sm text-muted-foreground">{blog.likesCount} likes</span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold">{blog.title}</h2>
          <p className="mt-3 text-muted-foreground">{blog.excerpt}</p>
          <p className="mt-5 leading-8 text-muted-foreground">{blog.content}</p>
          <div className="mt-6 rounded-[28px] border border-white/10 p-5">
            <p className="font-semibold">Comments</p>
            {blog.comments.map((comment) => (
              <div key={comment.id} className="mt-4 rounded-3xl bg-background/40 p-4">
                <div className="font-medium">{comment.user.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{comment.content}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
