// app/[organization]/[model]/GitReadmeFetch.tsx

"use client";

import React from "react";
import Image, { ImageLoaderProps } from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";

/**
 * Next.js loader that just returns the src as-is.
 * We use unoptimized to avoid messing up dynamic badges / raw GH images.
 */
function rawLoader({ src }: ImageLoaderProps) {
  return src;
}

/**
 * Rewrites <img> src:
 * 1) If absolute (http/https):
 *    - If "github.com" + "/blob/", convert to "raw.githubusercontent.com".
 *    - Else, return as-is (so we don't break partially encoded links).
 * 2) If relative ("figures/benchmark.png"),
 *    => "https://raw.githubusercontent.com/{org}/{repo}/main/figures/benchmark.png".
 */
function rewriteImageSrc(
  src: string,
  orgName: string,
  repoName: string,
): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    // If it's a GitHub "blob" => rewrite
    if (src.includes("github.com") && src.includes("/blob/")) {
      const urlObj = new URL(src);
      urlObj.searchParams.delete("raw"); // remove ?raw=true
      const parts = urlObj.pathname.split("/");
      // e.g. /deepseek-ai/DeepSeek-V2/blob/main/figures/badge.svg
      if (parts.length >= 5) {
        const org = parts[1];
        const repo = parts[2];
        const branch = parts[4];
        const rest = parts.slice(5).join("/");
        return `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${rest}`;
      }
    }
    // Otherwise, just return the absolute URL as-is (no double-encoding)
    return src;
  }

  // If it's relative => raw.githubusercontent link
  const stripped = src.replace(/^\.?\//, "");
  return `https://raw.githubusercontent.com/${orgName}/${repoName}/main/${stripped}`;
}

interface GitReadmeFetchProps {
  readmeContent: string;
  orgName: string;
  repoName: string;
}

/**
 * Renders the GitHub README content, rewriting images for Next.js <Image>.
 * Also respects <img width="..."> or <img height="..."> to replicate original sizes.
 */
export default function GitReadmeFetch({
  readmeContent,
  orgName,
  repoName,
}: GitReadmeFetchProps) {
  return (
    <div className="prose-readme prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          // Remove <br> so badges/links don't stack
          br: () => null,

          // Use Next.js <Image> for <img>
          img: ({ node, ...props }) => {
            const { alt = "" } = props;
            let src = props.src || "";

            // Rewrite the src if needed
            src = rewriteImageSrc(src, orgName, repoName);

            // If the original HTML had width or height, replicate them as inline styles
            // e.g. <img width="60%" height="100" />
            const { width, height, style } = (node?.properties as any) || {};

            // We'll build a style object
            const styleObj: React.CSSProperties = {};
            if (typeof style === "string") {
              // If the HTML had a style="..." attribute, we can parse it if needed
              // (For now we ignore advanced style, just rely on width/height attributes)
            }
            if (typeof width === "string") {
              // If user wrote width="60%", pass as style => { width: "60%", height: "auto" }
              // If user wrote width="400", Next.js doesn't allow numeric as style string
              if (width.endsWith("%")) {
                styleObj.width = width;
                styleObj.height = "auto";
              } else if (!isNaN(Number(width))) {
                // numeric
                styleObj.width = `${width}px`;
                styleObj.height = "auto";
              }
            }
            if (typeof height === "string") {
              // similarly handle height
              if (height.endsWith("%")) {
                styleObj.height = height;
              } else if (!isNaN(Number(height))) {
                styleObj.height = `${height}px`;
              }
            }

            return (
              <Image
                loader={rawLoader}
                unoptimized
                src={src}
                alt={alt}
                // Next tries to force layout if we pass numeric width/height
                // We'll rely on style instead
                width={0}
                height={0}
                sizes="100vw"
                style={
                  Object.keys(styleObj).length
                    ? styleObj
                    : { maxWidth: "100%", height: "auto" }
                }
                className="inline-block"
              />
            );
          },

          // External links => open in new tab
          a: ({ node, ...props }) => {
            const href = props.href || "";
            const isExternal = href.startsWith("http");
            return (
              <a
                className="inline-block"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer nofollow" : undefined}
                {...props}
              />
            );
          },

          // Reduce <hr> margins for a GitHub-like look
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-gray-300" {...props} />
          ),

          // Wrap tables for horizontal scrolling
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full table-auto border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border bg-gray-50 px-4 py-2 text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border px-4 py-2 align-top" {...props} />
          ),

          // <div align="center"> => flex layout
          div: ({ node, ...props }) => {
            if (props.align === "center") {
              return (
                <div
                  className="flex flex-wrap items-center justify-center gap-2 text-center"
                  {...props}
                />
              );
            }
            return <div {...props} />;
          },
        }}
      >
        {readmeContent}
      </ReactMarkdown>
    </div>
  );
}
