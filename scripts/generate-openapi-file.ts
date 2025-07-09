// scripts/generate-openapi-file.ts
import { swaggerSpec } from "../src/lib/swaggerDef"; // Adjust path
import fs from "fs";
import path from "path";

const outputPath = path.join(process.cwd(), "public", "openapi.json"); // Save to public folder

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), "utf8");
console.log(`OpenAPI spec generated at ${outputPath}`);
