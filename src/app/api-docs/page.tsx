// app/docs/page.tsx
import { SwaggerClient } from "@/components/swagger-client"; // Adjust the import path as necessary

// Optional: Add metadata for the page (good for SEO and browser tabs)
export const metadata = {
  title: "API Documentation",
  description: "Interactive API documentation for the Next.js application.",
};

export default function DocsPage() {
  // This is the URL of the Next.js API route that serves your OpenAPI JSON specification.
  // Make sure this matches the route you created (e.g., app/api/openapi/route.ts)
  const openApiSpecUrl = "/api/v1/openapi";

  return (
    <div className="min-h-screen bg-gray-100 py-8 dark:bg-gray-900">
      <div className="mx-8 overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
        {/* Render the client component, passing the URL to the OpenAPI spec */}
        <SwaggerClient specUrl={openApiSpecUrl} />
      </div>
    </div>
  );
}
