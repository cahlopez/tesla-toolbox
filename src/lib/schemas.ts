import z from "zod";

// Thing name format: TG1 followed by 11 alphanumeric characters
const THING_NAME_PATTERN = /^tg1[a-z0-9]{11}$/i;
// Multiple thing names format: One or more thing names separated by commas
const THING_NAMES_PATTERN = /^(tg1[a-z0-9]{11})(,tg1[a-z0-9]{11})*$/i;

const JWT_PATTERN = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

// Common error messages
const ERROR_MESSAGES = {
  thingName: {
    required: "Thing Name is required",
    format:
      "Thing Name must be in the format TG1XXXXXXXXXXX (where X is alphanumeric)",
    multipleFormat:
      "Thing Names must be in the format TG1XXXXXXXXXXX (where X is alphanumeric), separated by commas if multiple",
    invalidFormat:
      "Invalid format. Expected TG1 followed by 11 alphanumeric characters",
    invalidMultipleFormat:
      "Invalid format. Each thing name must be TG1 followed by 11 alphanumeric characters, separated by commas",
  },
  partNumber: {
    required: "Part number is required",
    invalidFormat:
      "Part number must be in the format: 0000000-00-A (7 digits, followed by 2 digits, followed by 1 letter)",
  },
  process: {
    required: "Process is required",
    invalidFormat: "Process can only contain letters, numbers, and dashes",
  },
  flow: {
    required: "Flow is required",
    invalidFormat: "Flow can only contain letters, numbers, and dashes",
  },
  flowStep: {
    required: "Flow Step is required",
    invalidFormat: "Flow Step can only contain letters, numbers, and dashes",
  },
} as const;

export const jwtTokenSchema = z.string().regex(JWT_PATTERN, "Invalid JWT");

export const thingNameSchema = (allowMultiple: boolean = false) =>
  z
    .string()
    .min(1, ERROR_MESSAGES.thingName.required)
    .transform((value) => value.trim().replace(/\s/g, ""))
    .refine(
      (value) =>
        allowMultiple
          ? THING_NAMES_PATTERN.test(value)
          : THING_NAME_PATTERN.test(value),
      {
        message: allowMultiple
          ? ERROR_MESSAGES.thingName.invalidMultipleFormat
          : ERROR_MESSAGES.thingName.invalidFormat,
      },
    );

export const partNumberSchema = z
  .string()
  .min(1, ERROR_MESSAGES.partNumber.required)
  .max(12, ERROR_MESSAGES.partNumber.invalidFormat)
  .transform((value) => value.trim().replace(/\s/g, ""))
  .refine(
    (value) => /^\d{7}-\d{2}-[a-z]$/i.test(value),
    ERROR_MESSAGES.partNumber.invalidFormat,
  );

export const containmentNameSchema = z
  .string()
  .min(1, { message: "Containment name is required." })
  .regex(/^ar\d{10}$/i, {
    message: "Containment name must be in format AR0000000000",
  })
  .transform((value) => value.trim());

export const processSchema = z.string().min(1, "Process Name is required");

export const flowSchema = z.string().min(1, "Flow Name is required");

export const flowStepSchema = z.string().min(1, "Flowstep Name is required");
