import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { Check, X } from "lucide-react";

type ButtonState = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

interface LoadingButtonProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  buttonState: ButtonState;
  idleText?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
}

export default function LoadingButton({
  className,
  buttonState,
  idleText = "Submit",
  loadingText = "Loading...",
  successText = "Success!",
  errorText = "Error!",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "relative h-10 w-[200px]",
        className,
        buttonState === "SUCCESS" &&
          "bg-green-600 text-white hover:bg-green-700",
        buttonState === "ERROR" && "bg-[#E31937] text-white hover:bg-[#E31937]",
      )}
      disabled={buttonState === "LOADING"}
    >
      <div className="relative h-full w-full">
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-opacity duration-200",
            buttonState === "IDLE" ? "opacity-100" : "opacity-0",
          )}
        >
          {idleText}
        </span>

        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-opacity duration-200",
            buttonState === "LOADING" ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            className="mr-2 invert"
            src="/spinner.svg"
            width={20}
            height={20}
            alt="Loading Spinner"
          />
          {loadingText}
        </span>

        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-opacity duration-200",
            buttonState === "SUCCESS" ? "opacity-100" : "opacity-0",
          )}
        >
          <Check className="mr-2 h-5 w-5 shrink-0" />
          {successText}
        </span>

        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center whitespace-nowrap transition-opacity duration-200",
            buttonState === "ERROR" ? "opacity-100" : "opacity-0",
          )}
        >
          <X className="mr-2 h-5 w-5 shrink-0" />
          {errorText}
        </span>
      </div>
    </Button>
  );
}
