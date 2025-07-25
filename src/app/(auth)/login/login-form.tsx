"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LockKeyhole, AlertCircle, CheckCircle } from "lucide-react";
import { attempt, cn } from "@/lib/utils";
import { ButtonState } from "@/lib/types";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [buttonState, setButtonState] = useState<ButtonState>("IDLE");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(submitData: LoginFormData) {
    setButtonState("LOADING");
    setError(null);
    const [response, error] = await attempt(
      fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      }),
    );

    if (error) {
      setError(error.message || "FX failed to respond.");
      setButtonState("ERROR");
      return;
    }

    if (response.ok) {
      setButtonState("SUCCESS");
      setTimeout(() => {
        router.push("/");
      }, 250);
    } else {
      setError("Login failed. Please check your credentials.");
      setButtonState("ERROR");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-4 py-3 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        {buttonState === "SUCCESS" && (
          <div className="flex items-center gap-2 rounded-md border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            Successfully signed in!
          </div>
        )}
        <FormField<LoginFormData>
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<LoginFormData>
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={cn(
            "w-full hover:cursor-pointer",
            buttonState === "SUCCESS" && "bg-green-700 text-white",
          )}
          disabled={buttonState === "LOADING"}
          variant={buttonState === "ERROR" ? "destructive" : "default"}
        >
          {buttonState === "LOADING"
            ? "Signing in..."
            : buttonState === "ERROR"
              ? "Try Again"
              : buttonState === "SUCCESS"
                ? "Success!"
                : "Sign In"}
        </Button>

        <div className="flex w-full items-center justify-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground px-2 text-sm">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#3e69e1] text-white hover:cursor-pointer"
          disabled={true}
        >
          <LockKeyhole style={{ height: "18px", width: "18px" }} />
          Microsoft SSO
        </Button>
      </form>
    </Form>
  );
}
