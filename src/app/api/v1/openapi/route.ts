import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * @swagger
 * /api/v1/openapi:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI specification file for the API documentation
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: OpenAPI specification returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI specification object
 */

// Read the static file from the public directory
const openApiSpecPath = join(process.cwd(), "public", "openapi.json");
const openApiSpec = JSON.parse(readFileSync(openApiSpecPath, "utf8"));

export async function GET() {
  return NextResponse.json(openApiSpec);
}
