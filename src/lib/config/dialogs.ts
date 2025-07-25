// config/dialogs.ts
import { DialogConfig, OnChangeCallback } from "@/lib/types";
import {
  WandSparkles,
  CircleAlert,
  CirclePause,
  CircleCheck,
  CircleArrowRight,
  Settings,
} from "lucide-react";
import {
  partNumberSchema,
  thingNameSchema,
  processSchema,
  flowSchema,
  flowStepSchema,
  containmentNameSchema,
} from "@/lib/schemas";

import { z } from "zod";

// --- OnChange Callbacks ---
const formatPartNumber: OnChangeCallback = (value, form) => {
  // Check if the last character is a dash
  const endsWithDash = value.endsWith("-");

  // Remove any existing dashes and spaces
  const cleaned = value.replace(/[-\s]/g, "");

  // Add dashes at the correct positions
  let formatted = cleaned;
  if (cleaned.length > 7) {
    formatted = `${cleaned.slice(0, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length > 9) {
    formatted = `${formatted.slice(0, 10)}-${formatted.slice(10)}`;
  }

  // If the user just typed a dash and it's in a valid position (after 7 or 9 digits)
  if (endsWithDash) {
    const currentLength = value.replace(/[-\s]/g, "").length;
    if (currentLength === 7 || currentLength === 9) {
      formatted += "-";
    }
  }

  // Update the form value with the formatted string
  form.setValue("partNumber", formatted);
};

const formatThingNames: OnChangeCallback = (value, form) => {
  // Check if there are multiple thing names (separated by spaces or newlines)
  const names = value
    .split(/[\s\n]+/)
    .filter((name: string) => name.length > 0);

  if (names.length > 1) {
    // Show confirmation dialog
    if (
      window.confirm("Would you like to format the thing names with commas?")
    ) {
      // Format with commas
      const formattedNames = names.join(",");
      form.setValue("thingNames", formattedNames);
    }
  } else {
    // Single thing name, just remove spaces
    form.setValue("thingNames", value.replace(/\s/g, ""));
  }
};

export const DIALOG_CONFIGS: DialogConfig[] = [
  {
    id: "changePartNumberDialog",
    title: "Change Part Number",
    description: "Change the part number of a given thing(s)",
    icon: WandSparkles,
    buttonText: "Change Part Number",
    form: {
      endpoint: "/api/v1/factory/thing/change-part-number",
      method: "POST",
      submitButtonText: "Change Part Number",
      onSuccessMessage: "Part number changed successfully!",
      onErrorMessage: "Failed to change part number.",
      schema: z.object({
        partNumber: partNumberSchema,
        thingNames: thingNameSchema(true),
      }),
      fields: [
        {
          id: "partNumber",
          name: "partNumber",
          label: "Part Number",
          type: "text",
          placeholder: "0000000-00-X",
          maxLength: 12,
          onChangeCallback: formatPartNumber,
        },
        {
          id: "thingNames",
          name: "thingNames",
          label: "Thing Name(s)",
          type: "textarea",
          placeholder: "TG100000000000",
          onChangeCallback: formatThingNames,
        },
      ],
    },
  },
  {
    id: "completeToMMSDialog",
    title: "Complete to MMS",
    description: "Complete a given thing(s) to MMS",
    icon: CircleCheck,
    buttonText: "Complete to MMS",
    disabled: true,
    form: {
      endpoint: "/api/v1/factory/thing/complete-to-mms",
      method: "POST",
      submitButtonText: "Complete to MMS",
      onSuccessMessage: "Things completed to MMS successfully!",
      onErrorMessage: "Failed to complete things to MMS.",
      schema: z.object({
        thingNames: thingNameSchema(true),
      }),
      fields: [
        {
          id: "thingNames",
          name: "thingNames",
          label: "Thing Name(s)",
          type: "textarea",
          placeholder: "TG100000000000",
          onChangeCallback: formatThingNames,
        },
      ],
    },
  },
  {
    id: "massHoldDialog",
    title: "Mass Hold",
    description: "Place a hold on a given thing(s).",
    icon: CirclePause,
    buttonText: "Mass Hold",
    form: {
      endpoint: "/api/v1/factory/ar/mass-hold",
      method: "POST",
      submitButtonText: "Mass Hold",
      onSuccessMessage: "Things placed on hold successfully!",
      onErrorMessage: "Failed to place things on hold.",
      schema: z.object({
        thingNames: thingNameSchema(true),
        containmentName: containmentNameSchema,
      }),
      fields: [
        {
          id: "thingNames",
          name: "thingNames",
          label: "Thing Name(s)",
          type: "textarea",
          placeholder: "TG100000000000",
          onChangeCallback: formatThingNames,
        },
        {
          id: "containmentName",
          name: "containmentName",
          label: "Containment Name",
          type: "text",
          placeholder: "AR0000000000",
        },
      ],
    },
  },
  {
    id: "closeNCsDialog",
    title: "Close NCs",
    description: "Close the NCs for a given thing(s).",
    icon: CircleAlert,
    buttonText: "Close NCs",
    form: {
      endpoint: "/api/v1/factory/nonconformance/close",
      method: "POST",
      submitButtonText: "Close NCs",
      onSuccessMessage: "NCs closed successfully!",
      onErrorMessage: "Failed to close NCs.",
      schema: z.object({
        thingNames: thingNameSchema(true),
      }),
      fields: [
        {
          id: "thingNames",
          name: "thingNames",
          label: "Thing Name(s)",
          type: "textarea",
          placeholder: "TG100000000000",
          onChangeCallback: formatThingNames,
        },
      ],
    },
  },
  {
    id: "moveToProcessDialog",
    title: "Move to Process",
    description: "Move a given thing to a given process.",
    icon: CircleArrowRight,
    buttonText: "Move to Process",
    form: {
      endpoint: "/api/v1/factory/thing/move-to-process",
      method: "POST",
      submitButtonText: "Move to Process",
      onSuccessMessage: "Thing moved to process successfully!",
      onErrorMessage: "Failed to move thing to process.",
      schema: z.object({
        thingName: thingNameSchema(false),
        processid: processSchema,
        flowid: flowSchema,
        flowstepid: flowStepSchema,
      }),
      fields: [
        {
          id: "thingName",
          name: "thingName",
          label: "Thing Name",
          type: "text",
          placeholder: "TG100000000000",
          maxLength: 14,
          required: true,
          onKeyDown: async (e, form) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const thingName = form.getValues("thingName");
              if (!thingName) return;

              try {
                const response = await fetch(
                  `/api/v1/factory/part/get-process/${thingName}`,
                  {
                    method: "GET",
                  },
                );

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(
                    errorData.results?.failed?.[0]?.error ||
                      "Failed to fetch process options",
                  );
                }

                const data = await response.json();

                const options = data.results.process.map((process: any) => ({
                  label: process.label,
                  value: process.label,
                }));

                form.setValue("_processidOptions", options);
              } catch (error) {
                console.log("error", error);
                form.setValue("_processidOptions", []);
                form.setError("thingName", {
                  type: "manual",
                  message:
                    error instanceof Error
                      ? error.message
                      : "Failed to fetch process options",
                });
              }
            }
          },
        },
        {
          id: "processid",
          name: "processid",
          label: "Process",
          type: "select",
          required: true,
          onChangeCallback: async (value, form) => {
            if (!value) return;
            try {
              const processName = processSchema.parse(value);

              const response = await fetch(
                `/api/v1/factory/flow/get-flow/${processName}`,
                {
                  method: "GET",
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.results?.failed?.[0]?.error ||
                    "Failed to fetch flow options",
                );
              }

              const data = await response.json();
              console.log("data", data);
              const options = data.results.flows.map((flow: any) => ({
                label: flow.label,
                value: flow.value,
              }));

              console.log("options", options);
              form.setValue("_flowidOptions", options);
            } catch (error) {
              console.log("error", error);
            }
          },
          options: (form) => {
            const options = form.getValues("_processidOptions");
            return options || [];
          },
          placeholder: "Select a process",
          disabled: (form) => !form.getValues("_processidOptions")?.length,
          dependencies: ["_processidOptions"],
        },
        {
          id: "flowid",
          name: "flowid",
          label: "Flow",
          type: "select",
          required: true,
          placeholder: "Select a flow",
          onChangeCallback: async (value, form) => {
            if (!value) return;
            try {
              const flowName = flowSchema.parse(value);

              const response = await fetch(
                `/api/v1/factory/flowstep/get-flowstep/${flowName}`,
                {
                  method: "GET",
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.results?.failed?.[0]?.error ||
                    "Failed to fetch flowstep options",
                );
              }

              const data = await response.json();

              const options = data.results.flowSteps.map((flowStep: any) => ({
                label: flowStep.label,
                value: flowStep.value,
              }));

              form.setValue("_flowstepidOptions", options);
            } catch (error) {
              console.log("error", error);
            }
          },
          options: (form) => {
            const options = form.getValues("_flowidOptions");
            return options || [];
          },
          disabled: (form) => !form.getValues("_flowidOptions")?.length,
          dependencies: ["_flowidOptions"],
        },
        {
          id: "flowstepid",
          name: "flowstepid",
          label: "Flow Step",
          type: "select",
          required: true,
          placeholder: "Select a flow step",
          options: (form) => {
            const options = form.getValues("_flowstepidOptions");
            return options || [];
          },
          disabled: (form) => !form.getValues("_flowstepidOptions")?.length,
          dependencies: ["_flowstepidOptions"],
        },
      ],
    },
  },
  {
    id: "moduleConfigureDialog",
    title: "Module Configure",
    description: "Configure a given module",
    icon: Settings,
    buttonText: "Module Configure",
    disabled: true,
    form: {
      endpoint: "/api/v1/factory/module/configure",
      method: "POST",
      submitButtonText: "Module Configure",
      onSuccessMessage: "Module configured successfully!",
      onErrorMessage: "Failed to configure module.",
      schema: z.object({
        moduleName: thingNameSchema(false),
      }),
      fields: [
        {
          id: "moduleName",
          name: "moduleName",
          label: "Module Name",
          type: "text",
          placeholder: "Module Name",
        },
      ],
    },
  },
  {
    id: "mmsToWipDialog",
    title: "MMS to WIP",
    description: "Move a given thing from MMS to WIP",
    icon: CircleArrowRight,
    buttonText: "MMS to WIP",
    form: {
      endpoint: "/api/v1/factory/thing/move-to-process",
      method: "POST",
      submitButtonText: "MMS to WIP",
      onSuccessMessage: "Thing moved to process successfully!",
      onErrorMessage: "Failed to move thing to process.",
      schema: z.object({
        thingName: thingNameSchema(false),
        processid: processSchema,
        flowid: flowSchema,
        flowstepid: flowStepSchema,
      }),
      fields: [
        {
          id: "thingName",
          name: "thingName",
          label: "Thing Name",
          type: "text",
          placeholder: "TG100000000000",
          maxLength: 14,
          required: true,
          onKeyDown: async (e, form) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const thingName = form.getValues("thingName");
              if (!thingName) return;

              try {
                const response = await fetch(
                  `/api/v1/factory/part/get-process/${thingName}`,
                  {
                    method: "GET",
                  },
                );

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(
                    errorData.results?.failed?.[0]?.error ||
                      "Failed to fetch process options",
                  );
                }

                const data = await response.json();

                const options = data.results.process.map((process: any) => ({
                  label: process.label,
                  value: process.label,
                }));

                form.setValue("_processidOptions", options);
              } catch (error) {
                console.log("error", error);
                form.setValue("_processidOptions", []);
                form.setError("thingName", {
                  type: "manual",
                  message:
                    error instanceof Error
                      ? error.message
                      : "Failed to fetch process options",
                });
              }
            }
          },
        },
        {
          id: "processid",
          name: "processid",
          label: "Process",
          type: "select",
          required: true,
          onChangeCallback: async (value, form) => {
            if (!value) return;
            try {
              const processName = processSchema.parse(value);

              const response = await fetch(
                `/api/v1/factory/flow/get-flow/${processName}`,
                {
                  method: "GET",
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.results?.failed?.[0]?.error ||
                    "Failed to fetch flow options",
                );
              }

              const data = await response.json();
              const options = data.results.flows.map((flow: any) => ({
                label: flow.label,
                value: flow.value,
              }));

              form.setValue("_flowidOptions", options);
            } catch (error) {
              console.log("error", error);
            }
          },
          options: (form) => {
            const options = form.getValues("_processidOptions");
            return options || [];
          },
          placeholder: "Select a process",
          disabled: (form) => !form.getValues("_processidOptions")?.length,
          dependencies: ["_processidOptions"],
        },
        {
          id: "flowid",
          name: "flowid",
          label: "Flow",
          type: "select",
          required: true,
          placeholder: "Select a flow",
          onChangeCallback: async (value, form) => {
            if (!value) return;
            try {
              const flowName = flowSchema.parse(value);

              const response = await fetch(
                `/api/v1/factory/flowstep/get-flowstep/${flowName}`,
                {
                  method: "GET",
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.results?.failed?.[0]?.error ||
                    "Failed to fetch flowstep options",
                );
              }

              const data = await response.json();

              const options = data.results.flowSteps.map((flowStep: any) => ({
                label: flowStep.label,
                value: flowStep.value,
              }));

              form.setValue("_flowstepidOptions", options);
            } catch (error) {
              console.log("error", error);
            }
          },
          options: (form) => {
            const options = form.getValues("_flowidOptions");
            return options || [];
          },
          disabled: (form) => !form.getValues("_flowidOptions")?.length,
          dependencies: ["_flowidOptions"],
        },
        {
          id: "flowstepid",
          name: "flowstepid",
          label: "Flow Step",
          type: "select",
          required: true,
          placeholder: "Select a flow step",
          options: (form) => {
            const options = form.getValues("_flowstepidOptions");
            return options || [];
          },
          disabled: (form) => !form.getValues("_flowstepidOptions")?.length,
          dependencies: ["_flowstepidOptions"],
        },
      ],
    },
  },
];

export const getDialogConfig = (id: string): DialogConfig | undefined => {
  return DIALOG_CONFIGS.find((config) => config.id === id);
};
