import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroHome } from "@/app/(landing)/home/Hero";
import { FeaturesHome } from "@/app/(landing)/home/Features";
import { Testimonials } from "@/app/(landing)/home/Testimonials";
import { FAQs } from "@/app/(landing)/home/FAQs";
import { CTA } from "@/app/(landing)/home/CTA";
import { BasicLayout } from "@/components/layouts/BasicLayout";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <BasicLayout>
      <HeroHome />
      <Testimonials />
      <FeaturesHome />
      <Suspense>
      </Suspense>
      <FAQs />
      <CTA />
    </BasicLayout>
  );
}