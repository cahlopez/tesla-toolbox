// components/dialogs/BaseDialog.tsx
"use client";

import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type LucideIcon } from "lucide-react"; // Import LucideIcon type

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  Icon?: LucideIcon; // Changed to accept LucideIcon directly
}

export function BaseDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  Icon,
}: BaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-x-2">
            {Icon && <Icon className="h-6 w-6 text-blue-600" />}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
