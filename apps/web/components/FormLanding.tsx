import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Example data for the marquee.
const marqueeItems = [
  {
    avatar: "/OrganizationIcons/google.png",
    model: "Gemini 1.0 Ultra",
    reference: "Gemini: A Family of Highly Capable Multimodal Models",
    accessibility: "API access",
    createdOn: "2023-12-06",
    verified: false,
  },
  {
    avatar: "/OrganizationIcons/openai.png",
    model: "GPT-4o",
    reference: "Hello GPT-4o",
    accessibility: "API access",
    createdOn: "2024-05-13",
    verified: false,
  },
  {
    avatar: "/OrganizationIcons/meta_ai.png",
    model: "Llama 3.1-405B",
    reference: "The Llama 3 Herd of Models",
    accessibility: "Open weights (restricted use)",
    createdOn: "2024-07-23",
    verified: true,
  },
  {
    avatar: "/OrganizationIcons/anthropic.png",
    model: "Claude 3.5 Sonnet",
    reference: "Claude 3.5 Sonnet",
    accessibility: "API access",
    createdOn: "2024-06-20",
    verified: true,
  },
  {
    avatar: "/OrganizationIcons/mistral_ai.png",
    model: "Mistral Large 2",
    reference:
      "Top-tier reasoning for high-complexity tasks, for your most sophisticated needs.",
    accessibility: "Open weights (non-commercial)",
    createdOn: "2024-07-24",
    verified: true,
  },
];

// Card to display each model item in the marquee
function ModelCard({
  avatar,
  model,
  reference,
  accessibility,
  createdOn,
  verified,
}: {
  avatar: string;
  model: string;
  reference: string;
  accessibility: string;
  createdOn: string;
  verified: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mr-4 w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex space-x-4">
        <Avatar>
          <AvatarImage src={avatar} alt={model} />
          <AvatarFallback>{model?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center">
            <h4 className="text-sm font-semibold">{model}</h4>
            {verified && (
              <img
                src="/verify.png"
                alt="Verified"
                className="ml-2 h-4 w-4 shrink-0"
              />
            )}
          </div>
          {reference && <p className="truncate text-sm">{reference}</p>}
          {accessibility && <Badge variant="outline">{accessibility}</Badge>}
          {createdOn && (
            <p className="text-xs text-muted-foreground">
              CREATED ON {createdOn}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// The main component that includes both the Meteors and the marquee
export function MeteorDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background p-4 md:shadow-xl">
      {/* The meteor animation area */}
      <div className="relative mb-4 flex h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
        <Meteors number={30} />
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-tremor-title font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 sm:text-tremor-title md:text-tremor-title">
          Explore 1000+ AI models on AIPortalX
        </span>
      </div>

      {/* The marquee section below the meteors */}
      {/* Container limits the marquee width to show ~1.5 cards and adds gradient effects on both sides */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ width: "384px" }}
      >
        <Marquee pauseOnHover className="[--duration:30s]">
          {marqueeItems.map((item, idx) => (
            <ModelCard key={idx} {...item} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </div>
  );
}
