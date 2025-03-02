"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponentProps,
} from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Prose } from "@/app/blog/components/Prose";
import { LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractTextFromPortableTextBlock, slugify } from "@/utils/text";

const builder = imageUrlBuilder(client);

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  mainImage: any;
  body: any;
  authorName: string;
  authorImage: any;
  authorTwitter: string;
  filterValue: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleReadMore = () => {
    setExpanded(true);
    // Add any async operations here if needed
  };

  const createHeadingComponent =
    (Tag: "h2" | "h3") =>
    ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => {
      const text = extractTextFromPortableTextBlock(value);
      const id = slugify(text);

      return (
        <Tag id={id} className="group relative flex items-center">
          <Link href={`#${id}`} className="flex items-center">
            <span className="absolute left-0 -translate-x-full pr-2 opacity-0 transition-opacity group-hover:opacity-100">
              <LinkIcon className="size-4" />
            </span>
            {children}
          </Link>
        </Tag>
      );
    };

  return (
    <Card className="mb-10">
      <CardContent className="p-10">
        <Prose>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          {/* Moved "Written by" section below the title */}
          <h3 className="text-tremor-default">Written by</h3>
          <div className="flex items-center">
            {post.authorImage && (
              <Image
                src={builder.image(post.authorImage).width(40).height(40).url()}
                alt={post.authorName ?? ""}
                className="mr-3 h-10 w-10 rounded-full"
                width={40}
                height={40}
              />
            )}
            <div>
              <p className="font-medium">{post.authorName}</p>
              {post.authorTwitter && (
                <Link
                  href={`https://twitter.com/${post.authorTwitter}`}
                  className="text-sm text-gray-500"
                  target="_blank"
                >
                  @{post.authorTwitter}
                </Link>
              )}
            </div>
          </div>
          {post.mainImage ? (
            <div className="-mx-10 my-8">
              <Image
                src={builder
                  .image(post.mainImage)
                  .width(1200)
                  .height(675)
                  .url()}
                alt={post?.mainImage?.alt || ""}
                width={1200}
                height={675}
                className="h-auto w-full"
              />
            </div>
          ) : null}
          <div
            className={
              !expanded ? "relative max-h-[100px] overflow-hidden" : ""
            }
          >
            <PortableText
              value={post.body}
              components={{
                block: {
                  h2: createHeadingComponent("h2"),
                  h3: createHeadingComponent("h3"),
                },
                types: {
                  image: ({ value }) => {
                    const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/;

                    const decodeAssetId = (id: string) => {
                      const match = pattern.exec(id);
                      if (!match) {
                        console.error(`Invalid asset ID: ${id}`);
                        return null;
                      }
                      const [, assetId, dimensions, format] = match;
                      const [width, height] = dimensions
                        .split("x")
                        .map((v) => Number.parseInt(v, 10));

                      return {
                        assetId,
                        dimensions: { width, height },
                        format,
                      };
                    };

                    const { dimensions } =
                      decodeAssetId(value.asset?._id) || {};

                    return (
                      <Image
                        src={builder.image(value).width(800).url()}
                        alt={value.alt || ""}
                        width={dimensions?.width || 800}
                        height={dimensions?.height || 600}
                        className="h-auto w-full"
                      />
                    );
                  },
                },
                marks: {
                  link: ({ children, value }) => {
                    const href = value?.href;
                    return (
                      <Link
                        href={href}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {children}
                      </Link>
                    );
                  },
                },
              }}
            />
            {!expanded && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-black"></div>
            )}
          </div>
        </Prose>
        {!expanded && (
          <Button
            variant="default"
            onClick={handleReadMore}
            className="mt-4 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-white transition-all hover:from-blue-600 hover:to-blue-800"
          >
            Read More
          </Button>
        )}
      </CardContent>
      {expanded && (
        <CardContent>
          {/* Removed TryInboxZero component */}
          <div className="mt-4">
            {/* Additional expanded content can go here */}
          </div>
          {/* Removed aside section */}
        </CardContent>
      )}
    </Card>
  );
}
