import { NextResponse } from "next/server";
import {
  thingNameSchema,
  processSchema,
  flowSchema,
  flowStepSchema,
  jwtTokenSchema,
} from "@/lib/schemas";
import { MOCK_THINGS } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/factory/thing/move-to-process:
 *   post:
 *     summary: Move a thing to a specific process step
 *     description: Moves a thing to a specified process, flow, and flow step
 *     tags:
 *       - Factory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - thingName
 *               - processid
 *               - flowid
 *               - flowstepid
 *               - token
 *               - username
 *             properties:
 *               thingName:
 *                 type: string
 *                 description: Name of the thing to move
 *                 example: "THING001"
 *               processid:
 *                 type: string
 *                 description: Process ID to move the thing to
 *                 example: "PROCESS_001"
 *               flowid:
 *                 type: string
 *                 description: Flow ID within the process
 *                 example: "FLOW_001"
 *               flowstepid:
 *                 type: string
 *                 description: Flow step ID within the flow
 *                 example: "STEP_001"
 *               token:
 *                 type: string
 *                 description: JWT authentication token
 *               username:
 *                 type: string
 *                 description: Username of the actor performing the action
 *                 example: "user@email.com"
 *     responses:
 *       200:
 *         description: Thing moved to process successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thing entered process successfully"
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

    const { thingName, processid, flowid, flowstepid, token, username } = body;

    // Validate thing name
    const validatedThingName = thingNameSchema(false).parse(thingName);
    // Validate process ID
    const validatedProcessName = processSchema.parse(processid);
    // Validate flow ID
    const validatedFlowName = flowSchema.parse(flowid);
    // Validate flow step ID
    const validatedFlowStepName = flowStepSchema.parse(flowstepid);
    // Validate token
    const validatedToken = jwtTokenSchema.parse(token);

    // Mock implementation - simulate API call
    if (MOCK_THINGS.includes(validatedThingName)) {
      return NextResponse.json({
        message: "Thing entered process successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Thing not found in mock data" },
        { status: 400 },
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
