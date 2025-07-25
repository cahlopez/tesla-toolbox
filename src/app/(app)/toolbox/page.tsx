"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DIALOG_CONFIGS } from "@/lib/config/dialogs";
import { useDialogManager } from "@/lib/hooks/useDialogManager";
import { DialogConfig } from "@/lib/types";
import { useState } from "react";

export default function Toolbox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<DialogConfig[]>(DIALOG_CONFIGS);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filteredResults = DIALOG_CONFIGS.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()),
    );

    setSearchResults(filteredResults);
  };

  const { openDialog } = useDialogManager();

  return (
    <main className="flex h-screen w-full flex-col items-center bg-[url('/cybertruck1.webp')] bg-cover bg-center bg-blend-overlay">
      <div className="mt-60 flex w-2/3 flex-col items-center">
        <Input
          className="bg-muted mb-6 w-70"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <div className="flex justify-center">
          <div className="grid w-full max-w-fit grid-cols-4 gap-6">
            {searchResults
              .sort((a, b) => {
                if (a.disabled === b.disabled) return 0;
                return a.disabled ? 1 : -1;
              })
              .map((dialog, index) => {
                return (
                  <Button
                    key={index}
                    onClick={() => !dialog.disabled && openDialog(dialog.id)}
                    className={`bg-card/90 hover:bg-card/60 text-primary flex h-25 w-70 items-center justify-start gap-x-1.5 transition-colors duration-50 hover:cursor-pointer ${dialog.disabled ? "hover:bg-card/90 opacity-70 hover:cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center pl-1">
                      <dialog.icon style={{ height: "32px", width: "32px" }} />
                      <div className="pl-4 text-left text-wrap">
                        <h3 className="text-md">{dialog.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {dialog.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
