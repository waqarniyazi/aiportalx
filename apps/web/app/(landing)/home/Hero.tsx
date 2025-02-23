"use client";

import { HeroSection } from "@/components/hero-section";

export default function Hero() {
  return (
    <HeroSection
      title="Discover, Compare, and Leverage AI Models Effortlessly"
      description="Your ultimate platform to explore AI models by task, domain, company, and country. Dive deeper with insightful blogs and expert reviews."
      actions={[
        {
          text: "Explore AI Models",
          href: "/models",
          variant: "default",
        },
      ]}
      image={{
        light: "/herolight.png",
        dark: "/herodark.png",
        alt: "UI Components Preview",
      }}
    />
  );
}
