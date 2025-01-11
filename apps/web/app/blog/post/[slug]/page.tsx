import type { ResolvingMetadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postPathsQuery, postQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Post } from "@/app/blog/post/[slug]/Post";
import type { Post as PostType } from "@/app/blog/types";
import { captureException } from "@/utils/error";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await client.fetch(postPathsQuery);
  return posts;
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
) {
  const post = await sanityFetch<PostType | undefined>({
    query: postQuery,
    params,
  });

  if (!post) {
    captureException(new Error("Post not found"), {
      extra: {
        params,
        query: postQuery,
      },
    });
    return {};
  }

  const previousImages = (await parent).openGraph?.images || [];

  const builder = imageUrlBuilder(client);
  const imageUrl = post.mainImage
    ? builder
        .image(post.mainImage)
        .auto("format")
        .fit("max")
        .width(1200)
        .height(630)
        .url()
    : undefined;

  return {
    title: post.title,
    description: post.description ?? "",
    alternates: { canonical: `/blog/post/${params.slug}` },
    openGraph: {
      images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
    },
  };
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }: Props) {
  const post = await sanityFetch<PostType>({ query: postQuery, params });

  return <Post post={post} />;
}
