import { fetchFilteredBlogPost } from "@/sanity/lib/fetchFilteredBlogPost";
import { PortableText } from "@portabletext/react";

export default async function FilteredBlogPost({ filters }) {
  const blogPost = await fetchFilteredBlogPost(filters);

  if (!blogPost) {
    return <div>No blog post found for the selected filters.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">{blogPost.title}</h2>
      <p className="mt-2">{blogPost.description}</p>
      <div className="mt-4">
        <PortableText value={blogPost.content} />
      </div>
    </div>
  );
}
