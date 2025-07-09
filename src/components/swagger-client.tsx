// components/SwaggerClient.tsx
"use client"; // This component must run in the browser

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css"; // Import the default Swagger UI styles

// Dynamically import SwaggerUI to ensure it's not bundled on the server side
// ssr: false is CRUCIAL here because SwaggerUI interacts with browser-specific APIs (window, document)
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

interface SwaggerClientProps {
  specUrl: string; // The URL where your OpenAPI spec JSON is served (e.g., /api/openapi)
}

export function SwaggerClient({ specUrl }: SwaggerClientProps) {
  return (
    // You can apply Tailwind CSS classes to this container
    <div className="swagger-ui-container">
      <SwaggerUI
        url={specUrl} // Point to the API route that serves your OpenAPI JSON
        deepLinking={true} // Enables deep linking for operations and tags
        docExpansion="none" // Controls how API sections are expanded ("list", "full", "none")
        // Other common options:
        // filter={true} // Enables filtering of operations
        // displayRequestDuration={true} // Displays the duration of a request
        // defaultModelsExpandDepth={-1} // Hides all models initially
        // defaultExamplesExpandDepth={-1} // Hides example sections
      />
    </div>
  );
}
