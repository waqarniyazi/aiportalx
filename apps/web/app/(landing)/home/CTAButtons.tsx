"use client";

import { Button } from "@/components/ui/button";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";

export function CTAButtons() {
  const posthog = usePostHog();
  return (
    <Link href="/login">
      <Button
        size="default"
        className="mt-10"
        onClick={() => {
          posthog.capture("Clicked Get Started");
        }}
        color="blue"
      >
        Explore Models Now
      </Button>
    </Link>
  );
}
