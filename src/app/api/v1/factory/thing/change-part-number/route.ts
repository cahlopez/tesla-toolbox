import { NextResponse } from "next/server";
import {
  thingNameSchema,
  partNumberSchema,
  jwtTokenSchema,
} from "@/lib/schemas";
import { MOCK_THINGS } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/factory/thing/change-part-number:
 *   post:
 *     summary: Change part number for one or more things
 *     description: Changes the part number of specified thing(s) to a given part number
 *     tags: [Factory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partNumber
 *               - thingNames
 *               - token
 *               - username
 *             properties:
 *               partNumber:
 *                 type: string
 *                 description: Target part number in format 0000000-00-X
 *                 example: "1234567-00-A"
 *               thingNames:
 *                 type: string
 *                 description: Comma-separated list of thing names
 *                 example: "THING001,THING002,THING003"
 *               token:
 *                 type: string
 *                 description: JWT authentication token
 *               username:
 *                 type: string
 *                 description: Username of the actor performing the action
 *                 example: "user@email.com"
 *     responses:
 *       200:
 *         description: Part number changes completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 results:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: array
 *                       items:
 *                         type: string
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           thingName:
 *                             type: string
 *                           error:
 *                             type: string
 *       400:
 *         description: Failed to change part numbers
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
 *                           thingName:
 *                             type: string
 *                           error:
 *                             type: string
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { partNumber, thingNames, token, username } = body;

    const validatedToken = jwtTokenSchema.parse(token);
    // Validate part number and remove all whitespace
    const validatedPartNumber = partNumberSchema.parse(partNumber);
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
        message: "Part number changes completed successfully",
        results: {
          successful: successfulItems,
          failed: failedItems,
        },
      });
    } else if (successfulItems.length === 0) {
      return NextResponse.json({
        error: "Failed to change part numbers.",
        results: {
          failed: failedItems,
        },
      });
    } else {
      return NextResponse.json({
        message: "Part number changes partially completed",
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
