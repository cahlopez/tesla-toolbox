"use client";

import React, { useState } from "react";
import { FormField } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// You might put this in lib/api.ts
async function submitFormData(
  endpoint: string,
  method: string,
  data: Record<string, any>,
) {
  // Dynamically import getUserToken and add token to the body
  const { getUserCookie } = await import("@/lib/auth");
  const userCookie = await getUserCookie();

  const dataWithToken = {
    ...data,
    token: userCookie?.token,
    username: userCookie?.username,
  };

  const response = await fetch(endpoint, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataWithToken),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || "An unknown error occurred");
  }
  return responseData;
}

interface DynamicFormProps {
  fields: FormField[];
  endpoint: string;
  method: string;
  submitButtonText?: string;
  onSuccessMessage?: string;
  onErrorMessage?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  schema: z.ZodObject<any, any, any, any, any>;
}

export function DynamicForm({
  fields,
  endpoint,
  method,
  submitButtonText = "Submit",
  onSuccessMessage = "Operation successful!",
  onErrorMessage = "Operation failed.",
  onClose,
  schema,
}: DynamicFormProps) {
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>(
    {},
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
    details?: {
      summary?: Record<string, any>;
      items?: Array<Record<string, any>>;
    };
  } | null>(null);
  const [asyncOptions, setAsyncOptions] = useState<
    Record<string, { value: string | number; label: string }[]>
  >({});

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce(
      (acc, field) => {
        // Initialize default values for React Hook Form from your field configs
        if (field.defaultValue !== undefined) {
          // Handle specific types for RHF default values
          if (field.type === "number") {
            acc[field.name] =
              field.defaultValue === null || field.defaultValue === undefined
                ? ""
                : Number(field.defaultValue);
          } else {
            acc[field.name] = field.defaultValue;
          }
        } else {
          // Ensure all schema fields have a default, even if null/undefined in config
          // This prevents React Hook Form from warning about uncontrolled components
          // (especially for required fields without an explicit defaultValue)
          acc[field.name] = "";
        }
        return acc;
      },
      {} as z.infer<typeof schema>,
    ),
    mode: "onChange", // Enable real-time validation
  });

  // Watch all form values to trigger re-renders when they change
  const formValues = form.watch();

  // Get all dependencies from fields
  const dependencies = fields
    .filter((field) => field.dependencies)
    .flatMap((field) => field.dependencies || []);

  React.useEffect(() => {
    // Find all fields that have dependencies
    const fieldsWithDependencies = fields.filter((field) => field.dependencies);

    // Update options for each field that has dependencies
    fieldsWithDependencies.forEach((field) => {
      if (field.dependencies) {
        const options = form.getValues(`_${field.name}Options`);
        if (options !== undefined) {
          setAsyncOptions((prev) => {
            // Only update if the options have changed
            if (JSON.stringify(prev[field.name]) === JSON.stringify(options)) {
              return prev;
            }
            return {
              ...prev,
              [field.name]: options || [],
            };
          });
        }
      }
    });
  }, [dependencies]);

  // Check if all required fields are filled
  const isFormValid = React.useMemo(() => {
    const values = form.getValues();
    return fields.every((field) => {
      if (!field.required) return true;
      const value = values[field.name];
      return value !== undefined && value !== null && value !== "";
    });
  }, [fields, formValues]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    setNotification(null);

    try {
      const response = await submitFormData(endpoint, method, values);

      // Check if response indicates partial success
      if (response.results?.failed?.length > 0) {
        setNotification({
          message: response.message || response.error || onSuccessMessage,
          type: response.error ? "error" : "warning",
          details: {
            items: response.results.failed,
          },
        });
      } else {
        setNotification({
          message: onSuccessMessage,
          type: "success",
        });
      }
    } catch (error: any) {
      setNotification({
        message: error.message || onErrorMessage,
        type: "error",
        details: error.response?.results
          ? {
              items: error.response.results.failed,
            }
          : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {notification && (
          <div
            className={cn(
              "flex flex-col gap-2 rounded-md border px-4 py-3 text-sm",
              notification.type === "success" &&
                "border-green-500/50 bg-green-500/10 text-green-700",
              notification.type === "error" &&
                "border-red-500/50 bg-red-500/10 text-red-400",
              notification.type === "warning" &&
                "border-yellow-500/50 bg-yellow-500/10 text-yellow-700",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification.type === "success" && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {notification.type === "error" && (
                  <AlertCircle className="h-4 w-4" />
                )}
                {notification.type === "warning" && (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {notification.message}
              </div>
              {(notification.type === "warning" ||
                notification.type === "error") &&
                notification.details?.items &&
                notification.details.items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className={cn(
                      "flex h-6 items-center gap-1 rounded-sm px-2 text-xs",
                      notification.type === "warning"
                        ? "hover:bg-yellow-500/10"
                        : "hover:bg-destructive/10",
                    )}
                  >
                    Details
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isDetailsOpen && "rotate-180",
                      )}
                    />
                  </button>
                )}
            </div>
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isDetailsOpen ? "grid-rows-[1fr]" : "hidden grid-rows-[0fr]",
              )}
            >
              {(notification.type === "warning" ||
                notification.type === "error") &&
                notification.details?.items && (
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "space-y-1 border-t pt-2 text-xs",
                        notification.type === "warning"
                          ? "border-yellow-500/20"
                          : "border-destructive/20",
                      )}
                    >
                      <div
                        className={cn(
                          "space-y-1",
                          notification.details.items.length > 4 &&
                            "max-h-[150px] overflow-y-auto pr-2",
                        )}
                      >
                        {notification.details.items.map((item, index) => (
                          <div key={index} className="ml-4">
                            {Object.entries(item).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="min-w-[100px] font-medium">
                                  {key}:
                                </span>
                                <span
                                  className={cn(
                                    notification.type === "warning"
                                      ? "text-yellow-600"
                                      : "text-red-400",
                                  )}
                                >
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {fields.map((field) => (
          <RHFFormField
            key={field.id}
            control={form.control}
            name={field.name as any}
            render={({ field: RHFField }) => (
              <FormItem className="grid grid-cols-4 items-start gap-4">
                <FormLabel className="text-right">
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </FormLabel>
                <div className="col-span-3 space-y-2">
                  <FormControl>
                    {field.type === "text" ||
                    field.type === "email" ||
                    field.type === "password" ? (
                      <Input
                        {...RHFField}
                        type={field.type}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        disabled={field.disabled?.(form)}
                        onChange={(e) => {
                          RHFField.onChange(e.target.value);
                          if (field.onChangeCallback) {
                            field.onChangeCallback(e.target.value, form);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (field.onKeyDown) {
                            field.onKeyDown(e, form);
                          }
                        }}
                      />
                    ) : field.type === "number" ? (
                      <Input
                        {...RHFField}
                        type="number"
                        placeholder={field.placeholder}
                        disabled={field.disabled?.(form)}
                        value={
                          RHFField.value === null ||
                          RHFField.value === undefined
                            ? ""
                            : RHFField.value
                        }
                        onChange={(e) => {
                          const numericValue =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value);
                          RHFField.onChange(numericValue);
                          if (field.onChangeCallback) {
                            field.onChangeCallback(numericValue, form);
                          }
                        }}
                      />
                    ) : field.type === "textarea" ? (
                      <Textarea
                        {...RHFField}
                        placeholder={field.placeholder}
                        rows={3}
                        disabled={field.disabled?.(form)}
                        onChange={(e) => {
                          RHFField.onChange(e.target.value);
                          if (field.onChangeCallback) {
                            field.onChangeCallback(e.target.value, form);
                          }
                        }}
                      />
                    ) : field.type === "select" ? (
                      <Select
                        onValueChange={(value) => {
                          RHFField.onChange(value);
                          if (field.onChangeCallback) {
                            field.onChangeCallback(value, form);
                          }
                          form.trigger(field.name);
                        }}
                        value={RHFField.value}
                        disabled={
                          field.disabled?.(form) || loadingOptions[field.name]
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingOptions[field.name]
                                ? "Loading..."
                                : field.placeholder ||
                                  `Select a ${field.label.toLowerCase()}`
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(typeof field.options === "function"
                            ? asyncOptions[field.name]
                            : field.options
                          )?.map((option) => (
                            <SelectItem
                              key={String(option.value)}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !isFormValid}>
            {loading ? "Processing..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
