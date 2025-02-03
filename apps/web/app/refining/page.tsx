import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { BicepsFlexed, Rocket, BellRing } from "lucide-react";
import Link from "next/link";
import { BlogLayout } from "@/components/layouts/BlogLayout";

export default function Refining() {
  return (
    <BlogLayout>
      <div className="mx-auto my-auto flex h-screen items-center justify-center">
        <Card className="max-w-8xl w-[100%] p-6 text-center">
          <CardHeader>
            <Image
              src="/comingsoon.gif"
              alt="Coming Soon"
              width={200}
              height={200}
              className="mx-auto mt-10"
            />
            <CardTitle>
              <TypingAnimation>🚀 Feature Coming Soon!</TypingAnimation>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <p>
              Thank you for your interest in using this AI model! We're actively
              working on making this feature available to you. Our goal is to
              provide a seamless and powerful experience, ensuring you can
              explore and integrate AI models effortlessly.
            </p>
            <Card className="bg-gray-100 p-4">
              <div className="flex items-center space-x-2">
                <BicepsFlexed className="h-7 w-7 text-blue-500" />
                <span className="font-semibold">Current Status:</span>
              </div>
              <p className="text-sm text-gray-700">
                We're in the development phase, fine-tuning every detail to
                ensure a smooth and efficient experience.
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <Rocket className="h-7 w-7 text-green-500" />
                <span className="font-semibold">Expected Launch:</span>
              </div>
              <p className="text-sm text-gray-700">
                Stay tuned! We’re making rapid progress and will announce
                updates soon.
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <BellRing className="h-7 w-7 text-yellow-500" />
                <span className="font-semibold">Want Early Access?</span>
              </div>
              <p className="text-sm text-gray-700">
                Sign up for updates, and be the first to know when this feature
                goes live!
              </p>
            </Card>
            <p>
              Meanwhile, feel free to explore other AI models, read our latest
              insights, or reach out with any feedback. Your patience and
              support mean the world to us!
            </p>
            <Link href="/models" passHref>
              <InteractiveHoverButton>
                Go Back to AI Models
              </InteractiveHoverButton>
            </Link>
          </CardContent>
        </Card>
      </div>
    </BlogLayout>
  );
}
