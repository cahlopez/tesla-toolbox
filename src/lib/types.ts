// BUTTON TYPES
export type ButtonState = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

// DIALOG TYPES
import { type LucideIcon } from "lucide-react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

export type FormFieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "radio";

export type OnChangeCallback = (
  value: any,
  form: UseFormReturn<any>, // Generic form object, as schema type varies
) => void;

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string | number | boolean | readonly string[] | number[]; // Allow array for multi-select (though select currently single)
  options?:
    | { value: string | number; label: string }[]
    | ((
        form: UseFormReturn<any>,
      ) => Promise<{ value: string | number; label: string }[]>);
  dependencies?: string[];
  onChangeCallback?: OnChangeCallback;
  disabled?: (form: UseFormReturn<any>) => boolean;
  onKeyDown?: (e: React.KeyboardEvent, form: UseFormReturn<any>) => void;
}

export type DynamicFormSchemaType = z.ZodObject<any, any, any, any, any>;

export interface DialogConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  disabled?: boolean;
  form: {
    fields: FormField[];
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    submitButtonText: string;
    onSuccessMessage: string;
    onErrorMessage: string;
    schema: DynamicFormSchemaType;
  };
}

export interface DialogState {
  isOpen: boolean;
  dialogId: string | null;
}
