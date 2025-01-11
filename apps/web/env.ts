/* eslint-disable no-process-env */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    NEXTAUTH_URL: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORGANIZATION: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    LOG_ZOD_ERRORS: z.coerce.boolean().optional(),
    CRON_SECRET: z.string().optional(),
    LOOPS_API_SECRET: z.string().optional(),
    FB_CONVERSION_API_ACCESS_TOKEN: z.string().optional(),
    FB_PIXEL_ID: z.string().optional(),
    ADMINS: z
      .string()
      .optional()
      .transform((value) => value?.split(",")),
    WEBHOOK_URL: z.string().optional(),
    INTERNAL_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().nonempty(),
    NEXT_PUBLIC_SANITY_DATASET: z.string().nonempty(),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2024-09-03"),

    NEXT_PUBLIC_LEMON_STORE_ID: z.string().nullish().default("inboxzero"),
    NEXT_PUBLIC_FREE_UNSUBSCRIBE_CREDITS: z.number().default(5),
    NEXT_PUBLIC_CALL_LINK: z
      .string()
      .default("https://cal.com/team/inbox-zero/feedback"),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_API_HOST: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HERO_AB: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_ONBOARDING_SURVEY_ID: z.string().optional(),
    NEXT_PUBLIC_BASE_URL: z.string().default("https://www.getinboxzero.com"),
    NEXT_PUBLIC_CONTACTS_ENABLED: z.coerce.boolean().optional().default(false),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    NEXT_PUBLIC_SUPPORT_EMAIL: z
      .string()
      .optional()
      .default("elie@getinboxzero.com"),
    NEXT_PUBLIC_GTM_ID: z.string().optional(),
    NEXT_PUBLIC_CRISP_WEBSITE_ID: z.string().optional(),
    NEXT_PUBLIC_DISABLE_TINYBIRD: z.coerce.boolean().optional().default(false),
    NEXT_PUBLIC_WELCOME_UPGRADE_ENABLED: z.coerce
      .boolean()
      .optional()
      .default(false),
    NEXT_PUBLIC_AXIOM_DATASET: z.string().optional(),
    NEXT_PUBLIC_AXIOM_TOKEN: z.string().optional(),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_LEMON_STORE_ID: process.env.NEXT_PUBLIC_LEMON_STORE_ID,
    NEXT_PUBLIC_FREE_UNSUBSCRIBE_CREDITS:
      process.env.NEXT_PUBLIC_FREE_UNSUBSCRIBE_CREDITS,
    NEXT_PUBLIC_CALL_LINK: process.env.NEXT_PUBLIC_CALL_LINK,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_API_HOST: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
    NEXT_PUBLIC_POSTHOG_HERO_AB: process.env.NEXT_PUBLIC_POSTHOG_HERO_AB,
    NEXT_PUBLIC_POSTHOG_ONBOARDING_SURVEY_ID:
      process.env.NEXT_PUBLIC_POSTHOG_ONBOARDING_SURVEY_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CONTACTS_ENABLED: process.env.NEXT_PUBLIC_CONTACTS_ENABLED,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_CRISP_WEBSITE_ID: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
    NEXT_PUBLIC_DISABLE_TINYBIRD: process.env.NEXT_PUBLIC_DISABLE_TINYBIRD,
    NEXT_PUBLIC_WELCOME_UPGRADE_ENABLED:
      process.env.NEXT_PUBLIC_WELCOME_UPGRADE_ENABLED,
    NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
    NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
  },
});
