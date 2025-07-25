import { NextResponse } from "next/server";
import { thingNameSchema } from "@/lib/schemas";

/**
 * @swagger
 * /api/v1/factory/thing/complete-to-mms:
 *   post:
 *     summary: Validate thing names for MMS completion
 *     description: Validates a comma-separated list of thing names for completion to MMS
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
 *             properties:
 *               thingNames:
 *                 type: string
 *                 description: Comma-separated list of thing names to validate
 *                 example: "THING001,THING002,THING003"
 *     responses:
 *       200:
 *         description: Thing names validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     thingNames:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of validated thing names
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { thingNames } = body;

    const validatedThingNames = thingNameSchema(true).parse(thingNames);
    // Split the validated thing names into an array and ensure no whitespace
    const thingNamesArray = validatedThingNames
      .split(",")
      .map((name) => name.trim());

    return NextResponse.json({
      message: "Validation successful",
      data: {
        thingNames: thingNamesArray,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
