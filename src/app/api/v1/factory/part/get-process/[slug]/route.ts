import { partNumberSchema, thingNameSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { MOCK_THINGS, getProcessOptionsForThing } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/factory/part/get-process/{slug}:
 *   get:
 *     summary: Get process options for a thing's part number
 *     description: Retrieves available process options for a thing based on its part number
 *     tags:
 *       - Factory
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Thing name to get process options for
 *         example: "THING001"
 *     responses:
 *       200:
 *         description: Process options retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched process"
 *                 results:
 *                   type: object
 *                   properties:
 *                     process:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                             description: Process name
 *                           value:
 *                             type: string
 *                             description: Process ID
 *                       description: Array of available process options
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 results:
 *                   type: object
 *                   properties:
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           error:
 *                             type: string
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Validate thing name
    const validatedThingName = thingNameSchema(false).parse(slug);

    // Mock implementation - simulate API call
    if (!MOCK_THINGS.includes(validatedThingName)) {
      return NextResponse.json(
        {
          error: "Thing not found in mock data",
          results: {
            failed: [{ error: "Thing not found in mock data" }],
          },
        },
        { status: 400 },
      );
    }

    const processOptions = getProcessOptionsForThing(validatedThingName);

    return NextResponse.json({
      message: "Successfully fetched process",
      results: {
        process: processOptions,
      },
    });
  } catch (error) {
    console.log("error", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          results: {
            failed: [{ error: error.message }],
          },
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: "Invalid request",
        results: {
          failed: [{ error: "Invalid request" }],
        },
      },
      { status: 400 },
    );
  }
}
