import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-editorial text-2xl text-ac-primary mb-6">New post</h1>
      <BlogForm />
    </div>
  );
}
