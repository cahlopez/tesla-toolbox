import { NextResponse } from "next/server";
import { jwtTokenSchema, thingNameSchema } from "@/lib/schemas";
import { MOCK_THINGS, MOCK_NONCONFORMANCES } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/factory/nonconformance/close:
 *   post:
 *     summary: Close nonconformances for multiple things
 *     description: Closes all open nonconformances for specified things with "NO PROBLEM FOUND" disposition
 *     tags:
 *       - Factory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - thingNames
 *               - token
 *             properties:
 *               thingNames:
 *                 type: string
 *                 description: Comma-separated list of thing names
 *                 example: "THING001,THING002,THING003"
 *               token:
 *                 type: string
 *                 description: JWT authentication token
 *     responses:
 *       200:
 *         description: Nonconformances closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "NCs closed successfully"
 *                 results:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of successfully processed thing names
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           thingName:
 *                             type: string
 *                           error:
 *                             type: string
 *                       description: List of failed operations with error details
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { thingNames, token } = body;

    const validatedToken = jwtTokenSchema.parse(token);
    // Validate thing names (allowing multiple comma-separated names) and remove all whitespace
    const validatedThingNames = thingNameSchema(true).parse(thingNames);
    // Split the validated thing names into an array and ensure no whitespace
    const thingNamesArray = validatedThingNames
      .split(",")
      .map((name) => name.trim());

    const successfulItems = [];
    const failedItems = [];

    for (const thingName of thingNamesArray) {
      // Mock implementation - simulate API call
      if (MOCK_THINGS.includes(thingName)) {
        // Check if there are any open nonconformances for this thing
        const openNCs = MOCK_NONCONFORMANCES.filter(
          (nc) => nc.thingName === thingName && nc.status === "OPEN",
        );

        if (openNCs.length > 0) {
          successfulItems.push(thingName);
        } else {
          successfulItems.push(thingName); // No NCs to close is still successful
        }
      } else {
        failedItems.push({
          thingName,
          error: "Thing not found in mock data",
        });
      }
    }

    if (failedItems.length === 0) {
      return NextResponse.json({
        message: "NCs closed successfully",
      });
    } else if (successfulItems.length === 0) {
      return NextResponse.json({
        error: "Failed to close NCs.",
        results: {
          failed: failedItems,
        },
      });
    } else {
      return NextResponse.json({
        message: "NCs closed partially",
        results: {
          successful: successfulItems,
          failed: failedItems,
        },
      });
    }
  } catch (error) {
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
