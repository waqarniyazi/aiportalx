import {
  captureException as sentryCaptureException,
  setUser,
} from "@sentry/nextjs";
import { APICallError, RetryError } from "ai";

export type ErrorMessage = { error: string; data?: any };
export type ZodError = {
  error: { issues: { code: string; message: string }[] };
};
export type ApiErrorType = {
  type: string;
  message?: string;
  code: number;
};

export function isError(value: any): value is ErrorMessage | ZodError {
  return value?.error;
}

export function isErrorMessage(value: any): value is ErrorMessage {
  return typeof value?.error === "string";
}

export function captureException(
  error: unknown,
  additionalInfo?: { extra?: Record<string, any> },
  userEmail?: string,
) {
  if (isKnownApiError(error)) {
    console.warn(`Known API error. email: ${userEmail}`, error, additionalInfo);
    return;
  }

  if (userEmail) setUser({ email: userEmail });
  sentryCaptureException(error, additionalInfo);
}

export type ActionError<E extends object = Record<string, unknown>> = {
  error: string;
} & E;
export type ServerActionResponse<
  T,
  E extends object = Record<string, unknown>,
> = ActionError<E> | T;

export function isActionError(error: any): error is ActionError {
  return error && typeof error === "object" && "error" in error && error.error;
}

// This class is used to throw error messages that are safe to expose to the client.
export class SafeError extends Error {
  constructor(
    public safeMessage: string,
    message?: string,
  ) {
    super(message || safeMessage);
    this.name = "SafeError";
  }
}

export function isGmailInsufficientPermissionsError(error: unknown): boolean {
  return (error as any)?.errors?.[0]?.reason === "insufficientPermissions";
}

export function isGmailRateLimitExceededError(error: unknown): boolean {
  return (error as any)?.errors?.[0]?.reason === "rateLimitExceeded";
}

export function isGmailQuotaExceededError(error: unknown): boolean {
  return (error as any)?.errors?.[0]?.reason === "quotaExceeded";
}

export function isIncorrectOpenAIAPIKeyError(error: APICallError): boolean {
  return error.message.includes("Incorrect API key provided");
}

export function isInvalidOpenAIModelError(error: APICallError): boolean {
  return error.message.includes(
    "does not exist or you do not have access to it",
  );
}

export function isOpenAIAPIKeyDeactivatedError(error: APICallError): boolean {
  return error.message.includes("this API key has been deactivated");
}

export function isAnthropicInsufficientBalanceError(
  error: APICallError,
): boolean {
  return error.message.includes(
    "Your credit balance is too low to access the Anthropic API",
  );
}

// Handling OpenAI retry errors on their own because this will be related to the user's own API quota,
// rather than an error on our side (as we default to Anthropic atm).
export function isOpenAIRetryError(error: RetryError): boolean {
  return error.message.includes("You exceeded your current quota");
}

// we don't want to capture these errors in Sentry
export function isKnownApiError(error: unknown): boolean {
  return (
    isGmailInsufficientPermissionsError(error) ||
    isGmailRateLimitExceededError(error) ||
    isGmailQuotaExceededError(error) ||
    (APICallError.isInstance(error) &&
      (isIncorrectOpenAIAPIKeyError(error) ||
        isInvalidOpenAIModelError(error) ||
        isOpenAIAPIKeyDeactivatedError(error) ||
        isAnthropicInsufficientBalanceError(error))) ||
    (RetryError.isInstance(error) && isOpenAIRetryError(error))
  );
}

export function checkCommonErrors(
  error: unknown,
  url: string,
): ApiErrorType | null {
  if (isGmailInsufficientPermissionsError(error)) {
    console.warn(`Gmail insufficient permissions error for url: ${url}`);
    return {
      type: "Gmail Insufficient Permissions",
      message:
        "You must grant all Gmail permissions to use the app. Please log out and log in again to grant permissions.",
      code: 403,
    };
  }

  if (isGmailRateLimitExceededError(error)) {
    console.warn(`Gmail rate limit exceeded for url: ${url}`);
    const errorMessage =
      (error as any)?.errors?.[0]?.message ?? "Unknown error";
    return {
      type: "Gmail Rate Limit Exceeded",
      message: `Gmail error: ${errorMessage}`,
      code: 429,
    };
  }

  if (isGmailQuotaExceededError(error)) {
    console.warn(`Gmail quota exceeded for url: ${url}`);
    return {
      type: "Gmail Quota Exceeded",
      message: "You have exceeded the Gmail quota. Please try again later.",
      code: 429,
    };
  }

  if (RetryError.isInstance(error) && isOpenAIRetryError(error)) {
    console.warn(`OpenAI quota exceeded for url: ${url}`);
    return {
      type: "OpenAI Quota Exceeded",
      message: `OpenAI error: ${error.message}`,
      code: 429,
    };
  }

  return null;
}
