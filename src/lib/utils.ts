import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeJwtPayload<T = Record<string, unknown>>(
  token: string,
): T | null {
  if (!token || typeof token !== "string") {
    console.error("Invalid token: must be a non-empty string");
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format. Expected 3 parts.");
      return null;
    }

    const payloadBase64 = parts[1];
    // Validate base64url characters
    if (!/^[A-Za-z0-9_-]+$/.test(payloadBase64)) {
      console.error(
        "Invalid characters in payload. Only A-Z, a-z, 0-9, _, and - are allowed.",
      );
      return null;
    }

    // Base64Url decode: replace - with +, _ with /, then add padding = if needed
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const base64WithPadding = base64 + padding;

    try {
      const decodedPayload = atob(base64WithPadding);
      return JSON.parse(decodedPayload) as T;
    } catch (decodeError) {
      console.error("Base64 decoding failed:", decodeError);
      console.error("Base64 string:", base64WithPadding);
      return null;
    }
  } catch (error) {
    console.error("Error decoding JWT payload:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return null;
  }
}

type AttemptSuccess<T> = readonly [T, null];
type AttemptFailure<E> = readonly [null, E];
type AttemptResult<E, T> = AttemptSuccess<T> | AttemptFailure<E>;
type AttemptResultAsync<E, T> = Promise<AttemptResult<E, T>>;

export function attempt<E = Error, T = Promise<any>>(
  operation: T,
): AttemptResultAsync<E, Awaited<T>>;
export function attempt<E = Error, T = any>(
  operation: () => T,
): AttemptResult<E, T>;
export function attempt<E = Error, T = any>(
  operation: Promise<T> | (() => T),
): AttemptResult<E, T> | AttemptResultAsync<E, Awaited<T>> {
  if (operation instanceof Promise) {
    return (async () => {
      try {
        const value = await operation;
        return [value, null] as const;
      } catch (error) {
        return [null, error as E] as const;
      }
    })();
  }

  try {
    const data = operation();
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}
