import { Metadata } from "next";
import { generateMetadata } from "./metadata"; // Import from metadata.ts

export { generateMetadata };

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { filters?: string[] };
}) {
  return <>{children}</>;
}
