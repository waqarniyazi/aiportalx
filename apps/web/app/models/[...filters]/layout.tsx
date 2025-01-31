import { Metadata } from "next";
import { generateMetadata } from "./metadata"; // Import from metadata.ts

export { generateMetadata };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
