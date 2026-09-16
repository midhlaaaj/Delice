"use client";

import { useState } from "react";
import { upsertBlogPost } from "@/lib/actions/blog";
import { ImageUploadField } from "./image-upload-field";
import { FallbackColorField } from "./fallback-color-field";
import { BlogPreviewCard } from "./blog-preview-card";
import { Button } from "@/components/button";
import { adminInput, adminLabel, ToggleField } from "./admin-ui";
import type { BlogPost } from "@/db/schema";

export function BlogForm({ post }: { post?: BlogPost }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? "Journal");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [readMinutes, setReadMinutes] = useState(post?.readMinutes ?? 4);
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(post?.coverImageUrl ?? undefined);
  const [colorFrom, setColorFrom] = useState(post?.colorFrom ?? "#EFC3CD");
  const [colorTo, setColorTo] = useState(post?.colorTo ?? "#D68C9E");

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      <form action={upsertBlogPost} className="grid gap-5 max-w-xl w-full">
        {post && <input type="hidden" name="id" value={post.id} />}

        <div>
          <label className={adminLabel}>Slug</label>
          <input name="slug" defaultValue={post?.slug} required className={adminInput} />
        </div>

        <div>
          <label className={adminLabel}>Title</label>
          <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={adminInput} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={adminLabel}>Category</label>
            <input
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Recipes"
              className={adminInput}
            />
          </div>
          <div>
            <label className={adminLabel}>Read time (minutes)</label>
            <input
              name="readMinutes"
              type="number"
              min={1}
              value={readMinutes}
              onChange={(e) => setReadMinutes(Number(e.target.value) || 1)}
              className={adminInput}
            />
          </div>
        </div>

        <div>
          <label className={adminLabel}>Author</label>
          <input name="author" defaultValue={post?.author ?? "Team Delice"} className={adminInput} />
        </div>

        <div>
          <label className={adminLabel}>Excerpt</label>
          <textarea
            name="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={2}
            placeholder="A short teaser shown on the blog listing card"
            className={adminInput}
          />
        </div>

        <div>
          <label className={adminLabel}>Content</label>
          <textarea
            name="content"
            defaultValue={post?.content}
            required
            rows={12}
            placeholder="Separate paragraphs with a blank line"
            className={`${adminInput} font-mono`}
          />
        </div>

        <FallbackColorField
          defaultFrom={post?.colorFrom}
          defaultTo={post?.colorTo}
          onChange={(from, to) => {
            setColorFrom(from);
            setColorTo(to);
          }}
        />

        <ImageUploadField
          name="coverImageUrl"
          label="Cover photo"
          defaultValue={post?.coverImageUrl}
          folder="blog"
          cropAspect={3 / 2}
          cropOutputSize={{ w: 1200, h: 800 }}
          onUploaded={setCoverImageUrl}
        />

        <div>
          <label className={adminLabel}>Sort order</label>
          <input name="sortOrder" type="number" defaultValue={post?.sortOrder ?? 0} className={`${adminInput} w-32`} />
        </div>

        <ToggleField name="isPublished" label="Published" defaultChecked={post?.isPublished ?? true} />

        <Button type="submit" className="w-fit">
          Save post
        </Button>
      </form>

      <BlogPreviewCard
        title={title}
        category={category}
        excerpt={excerpt}
        readMinutes={readMinutes}
        coverImageUrl={coverImageUrl}
        colorFrom={colorFrom}
        colorTo={colorTo}
      />
    </div>
  );
}
