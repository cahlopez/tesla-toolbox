"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { DialogState } from "@/lib/types";

interface DialogContextType {
  dialogState: DialogState;
  openDialog: (id: string) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    dialogId: null,
  });

  const openDialog = (id: string) => {
    setDialogState({ isOpen: true, dialogId: id });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false, dialogId: null });
  };

  return (
    <DialogContext.Provider value={{ dialogState, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialogManager() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogManager must be used within a DialogProvider");
  }
  return context;
}
