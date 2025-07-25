import { NextResponse } from "next/server";
import {
  thingNameSchema,
  containmentNameSchema,
  jwtTokenSchema,
} from "@/lib/schemas";
import { MOCK_THINGS, MOCK_CONTAINMENTS } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/factory/ar/mass-hold:
 *   post:
 *     summary: Put multiple things on hold in AR containment
 *     description: Places multiple things on hold in a specified AR containment by importing them as suspects
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
 *               - containmentName
 *               - token
 *             properties:
 *               thingNames:
 *                 type: string
 *                 description: Comma-separated list of thing names to put on hold
 *                 example: "THING001,THING002,THING003"
 *               containmentName:
 *                 type: string
 *                 description: Name of the AR containment
 *                 example: "AR_CONTAINMENT_001"
 *               token:
 *                 type: string
 *                 description: JWT authentication token
 *     responses:
 *       200:
 *         description: Things put on hold successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thing(s) put on hold successfully"
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

    const { thingNames, containmentName, token } = body;

    const validatedToken = jwtTokenSchema.parse(token);
    // Validate containment ID and remove all whitespace
    const validatedContainmentName =
      containmentNameSchema.parse(containmentName);
    // Validate thing names (allowing multiple comma-separated names) and remove all whitespace
    const validatedThingNames = thingNameSchema(true).parse(thingNames);
    // Split the validated thing names into an array and ensure no whitespace
    const thingNamesArray = validatedThingNames
      .split(",")
      .map((name) => name.trim());

    const successfulItems = [];
    const failedItems = [];

    // Mock implementation - simulate API calls
    if (!MOCK_CONTAINMENTS.includes(validatedContainmentName)) {
      return NextResponse.json(
        {
          error: "Containment not found in mock data",
          results: {
            failed: [{ error: "Containment not found in mock data" }],
          },
        },
        { status: 400 },
      );
    }

    for (const thingName of thingNamesArray) {
      if (MOCK_THINGS.includes(thingName)) {
        successfulItems.push(thingName);
      } else {
        failedItems.push({
          thingName,
          error: "Thing not found in mock data",
        });
      }
    }

    if (failedItems.length === 0) {
      return NextResponse.json({
        message: "Thing(s) put on hold successfully",
      });
    } else if (successfulItems.length === 0) {
      return NextResponse.json({
        error: "Failed to put thing(s) on hold",
        results: {
          failed: failedItems,
        },
      });
    } else {
      return NextResponse.json({
        message: "Thing(s) put on hold partially",
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
