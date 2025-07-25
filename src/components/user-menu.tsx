"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { attempt } from "@/lib/utils";
import { toast } from "sonner";

interface UserMenuProps {
  username: string;
}

export default function UserMenu({ username }: UserMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const [response, error] = await attempt(
      fetch("/api/v1/auth/logout", {
        method: "POST",
      }),
    );

    if (error) {
      toast.error("Failed to logout. Please try again.");
      return;
    }

    if (response.ok) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-row items-center">
      <span className="mr-4">{username}</span>
      <Avatar className="mr-4">
        <AvatarImage src="https://avatar.iran.liara.run/public" />
        <AvatarFallback className="bg-muted-foreground">P</AvatarFallback>
      </Avatar>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="text-muted-foreground hover:text-foreground -mr-2 -ml-3"
        title="Logout"
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}
