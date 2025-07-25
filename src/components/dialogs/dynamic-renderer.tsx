// components/dialogs/DialogRenderer.tsx
"use client";

import { useDialogManager } from "@/lib/hooks/useDialogManager";
import { BaseDialog } from "./base-dialog";
import { DynamicForm } from "./forms/dynamic-form";
import { getDialogConfig } from "@/lib/config/dialogs";

export function DialogRenderer() {
  const { dialogState, closeDialog } = useDialogManager();
  const { isOpen, dialogId } = dialogState;

  if (!isOpen || !dialogId) {
    return null;
  }

  const config = getDialogConfig(dialogId);

  if (!config) {
    console.error(`Dialog config not found for ID: ${dialogId}`);
    return null;
  }

  const IconComponent = config.icon;

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={closeDialog}
      title={config.title}
      description={config.description}
      Icon={IconComponent}
    >
      <DynamicForm
        fields={config.form.fields}
        endpoint={config.form.endpoint}
        method={config.form.method}
        submitButtonText={config.form.submitButtonText}
        onSuccessMessage={config.form.onSuccessMessage}
        onErrorMessage={config.form.onErrorMessage}
        onSuccess={() => {
          /* Add any post-submission success actions here if needed */
        }}
        onClose={closeDialog}
        schema={config.form.schema}
      />
    </BaseDialog>
  );
}
