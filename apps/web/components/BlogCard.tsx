import { useEffect, useState } from "react";
import { fetchFilteredBlogPost } from "@/sanity/lib/fetchFilteredBlogPost";
import { PortableText } from "@portabletext/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogCard({ filters }) {
  const [blogPost, setBlogPost] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      console.log("Filters:", filters);
      const blogPost = await fetchFilteredBlogPost({
        task: filters.Task?.[0],
        domain: filters.Domain?.[0],
        organization: filters.Organization?.[0],
        country: filters.Country?.[0],
      });
      console.log("Fetched Blog Post:", blogPost);
      setBlogPost(blogPost);
    };

    fetchBlogPost();
  }, [filters]);

  if (!blogPost) {
    return <div>No blog post found for the selected filters.</div>;
  }

  return (
    <Card className="mb-4">
      <CardContent>
        <h2 className="text-2xl font-bold">{blogPost.title}</h2>
        <p className="mt-2">{blogPost.description}</p>
        <div className="mt-4">
          <PortableText value={blogPost.content.slice(0, 100)} />
          {blogPost.content.length > 100 && (
            <Button variant="link" onClick={() => alert("Read More clicked")}>
              Read More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
