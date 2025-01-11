"use client";

import { useLandingPageVariant } from "@/hooks/useFeatureFlags";
import clsx from "clsx";
import {
  BarChart2Icon,
  EyeIcon,
  LineChart,
  type LucideIcon,
  MousePointer2Icon,
  Orbit,
  ShieldHalfIcon,
  Sparkles,
  SparklesIcon,
  TagIcon,
  BlocksIcon,
  ListStartIcon,
} from "lucide-react";
import Image from "next/image";

export function FeaturesPrivacy() {
  return (
    <div className="bg-white py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="font-cal text-base leading-7 text-blue-600">
            Made for Everyone
          </h2>
          <p className="mt-2 font-cal text-3xl text-gray-900 sm:text-4xl">
          Empowering India with AI Excellence
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
          AI PortalX bridges the gap between AI model data and insightful content, ensuring every user finds the tools and knowledge they need to succeed in their AI endeavors.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FeaturesWithImage(props: {
  imageSide: "left" | "right";
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: {
    name: string;
    description: string;
    icon: LucideIcon;
  }[];
}) {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div
            className={clsx(
              "lg:pt-4",
              props.imageSide === "left"
                ? "lg:ml-auto lg:pl-4"
                : "lg:mr-auto lg:pr-4",
            )}
          >
            <div className="lg:max-w-lg">
              <h2 className="font-cal text-base leading-7 text-blue-600">
                {props.title}
              </h2>
              <p className="mt-2 font-cal text-3xl text-gray-900 sm:text-4xl">
                {props.subtitle}
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {props.description}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {props.features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div
            className={clsx(
              "flex items-start",
              props.imageSide === "left"
                ? "justify-end lg:order-first"
                : "justify-start lg:order-last",
            )}
          >
            <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
              <Image
                src={props.image}
                alt="Product screenshot"
                className="w-[48rem] max-w-none rounded-xl shadow-2xl ring-1 ring-gray-400/10 sm:w-[57rem]"
                width={2400}
                height={1800}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const featuresAutomations = [
  {
    name: "Extensive AI Listings",
    description:
      "Explore an unmatched collection of over 1000+ AI models, complete with comprehensive details and user ratings.",
    icon: Sparkles,
  },
  {
    name: "Smart Filters",
    description:
      "Effortlessly narrow down AI models using task types, domains, companies, and countries for precision.",
    icon: Orbit,
  },
  {
    name: "Simplified Access",
    description:
      "Navigate seamlessly with our structured, user-friendly database designed for clarity and ease.",
    icon: LineChart,
  },
];

export function FeaturesAutomation() {
  const variant = useLandingPageVariant();

  const variants: Record<
    string,
    {
      title: string;
      subtitle: string;
    }
  > = {
    control: {
      title: "Comprehensive Database",
      subtitle: "Your one-stop AI model hub.",
    },
    benefit: {
      title: "AI Email Assistant",
      subtitle: "Sorting, replying, archiving. Automate on your own terms.",
    },
  };

  const selectedVariant =
    typeof variant === "string" ? variants[variant] : variants.control;

  return (
    <FeaturesWithImage
      imageSide="left"
      title={selectedVariant.title}
      subtitle={selectedVariant.subtitle}
      description="Comprehensive and Exhaustive Database of AI Models"
      image="/images/ai-automation.png"
      features={featuresAutomations}
    />
  );
}

const featuresColdEmailBlocker = [
  {
    name: "Advanced Filters",
    description:
      "Utilize powerful, customizable filters for finding exactly what you need from the database.",
    icon: ShieldHalfIcon,
  },
  {
    name: "Comparative Analysis",
    description:
      " Compare AI models across various metrics to make informed decisions.",
    icon: SparklesIcon,
  },
  {
    name: "Save Favorites",
    description:
      "Bookmark and organize your preferred AI models for quick, hassle-free future access.",
    icon: TagIcon,
  },
];

export function FeaturesColdEmailBlocker() {
  const variant = useLandingPageVariant();

  const variants: Record<
    string,
    {
      subtitle: string;
      description: string;
    }
  > = {
    control: {
      subtitle: "Smart Filters for Precise AI Model Selection",
      description: "Precision and efficiency at your fingertips.",
    },
    benefit: {
      subtitle: "Keep salespeople at the gate",
      description:
        "Block outreach emails you never signed up for and regain control of your inbox.",
    },
  };

  const selectedVariant =
    typeof variant === "string" ? variants[variant] : variants.control;

  return (
    <FeaturesWithImage
      imageSide="left"
      title="Tailored Results"
      subtitle={selectedVariant.subtitle}
      description={selectedVariant.description}
      image="/images/cold-email-blocker.png"
      features={featuresColdEmailBlocker}
    />
  );
}

const featuresStats = [
  {
    name: "Beginner Friendly",
    description:
      "Tailored for beginners, developers, researchers, and AI practitioners to foster innovation.",
    icon: Sparkles,
  },
  {
    name: "Reliable Insights",
    description:
      "Access actionable insights to guide your AI projects with data-driven confidence.",
    icon: Orbit,
  },
  {
    name: "Authentic Reviews",
    description:
      "Build confidence with reviews backed by verified users and expert contributors.",
    icon: LineChart,
  },
];

export function FeaturesStats() {
  return (
    <FeaturesWithImage
      imageSide="right"
      title="Trusted Resource"
      subtitle="Trusted by Experts, Innovators, and Enthusiasts Alike"
      description="Empowering AI enthusiasts and professionals to achieve more."
      image="/images/analytics.png"
      features={featuresStats}
    />
  );
}

const featuresUnsubscribe = [
  {
    name: "Informative Guides",
    description:
      "Dive into detailed guides and expert tutorials designed to elevate your understanding of AI technologies.",
    icon: MousePointer2Icon,
  },
  {
    name: "How-To Articles",
    description:
      "Simplified how-to articles crafted for both beginners and seasoned professionals in the AI industry.",
    icon: EyeIcon,
  },
  {
    name: "Trending Topics",
    description:
      "Stay updated with the latest trends and advancements in AI, regularly curated and updated for relevance",
    icon: BarChart2Icon,
  },
];

export function FeaturesUnsubscribe() {
  const variant = useLandingPageVariant();

  const variants: Record<
    string,
    {
      subtitle: string;
      description: string;
    }
  > = {
    control: {
      subtitle: "Rich and Engaging AI-Focused Content",
      description:
        "Enhance your AI expertise and stay ahead in the field.",
    },
    benefit: {
      subtitle: "No more newsletters you never read",
      description:
        "Bulk unsubscribe from emails in one click. View all your subscriptions and how often you read each one.",
    },
  };

  const selectedVariant =
    typeof variant === "string" ? variants[variant] : variants.control;

  return (
    <FeaturesWithImage
      imageSide="right"
      title="Stay Updated"
      subtitle={selectedVariant.subtitle}
      description={selectedVariant.description}
      image="/images/newsletters.png"
      features={featuresUnsubscribe}
    />
  );
}

export function FeaturesHome() {
  return (
    <>
      <FeaturesPrivacy />
      <FeaturesAutomation />
      <FeaturesUnsubscribe />
      <FeaturesColdEmailBlocker />
      <FeaturesStats />
    </>
  );
}

const featuresNewSenders = [
  {
    name: "Quickly Identify New Senders",
    description:
      "Conveniently lists all new individuals or entities that recently emailed you, helping you spot important contacts.",
    icon: EyeIcon,
  },
  {
    name: "Effortless Blocking",
    description:
      "Easily block any unwanted sender with a single click, keeping your inbox clean and relevant.",
    icon: ShieldHalfIcon,
  },
  {
    name: "Stay Organized and Secure",
    description:
      "Enhance your email security by managing unfamiliar senders, reducing the risk of spam and phishing attacks.",
    icon: BlocksIcon,
  },
  {
    name: "Personalize Your Email Experience",
    description:
      "Discover and prioritize important emails, ensuring you never miss out on significant introductions or opportunities.",
    icon: ListStartIcon,
  },
];

export function FeaturesNewSenders() {
  return (
    <FeaturesWithImage
      imageSide="left"
      title="New Sender List"
      subtitle="Manage new senders in your inbox"
      description="View a comprehensive list of recent new senders, making it easier to spot important contacts and opportunities, while also offering the ability to block unwanted communication effortlessly."
      image="/images/newsletters.png"
      features={featuresNewSenders}
    />
  );
}
