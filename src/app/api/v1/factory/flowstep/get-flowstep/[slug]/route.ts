import { flowSchema, processSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROCESSES, getFlowStepOptionsForFlow } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/factory/flowstep/get-flowstep/{slug}:
 *   get:
 *     summary: Get active flow steps for a flow
 *     description: Retrieves all active flow steps for a specified flow name
 *     tags:
 *       - Factory
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Flow name to get flow steps for
 *         example: "FLOW_001"
 *     responses:
 *       200:
 *         description: Active flow steps retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched flowsteps"
 *                 results:
 *                   type: object
 *                   properties:
 *                     flowSteps:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: Array of active flow steps
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

    const validatedFlowName = flowSchema.parse(slug);

    // Mock implementation - simulate API call
    // Find the process that contains this flow
    let foundProcess = null;
    let foundFlow = null;

    for (const [processId, process] of Object.entries(MOCK_PROCESSES)) {
      const flow = process.flows.find((f) => f.name === validatedFlowName);
      if (flow) {
        foundProcess = process.name;
        foundFlow = flow;
        break;
      }
    }

    if (!foundFlow) {
      return NextResponse.json(
        {
          error: "Flow not found in mock data",
          results: {
            failed: [{ error: "Flow not found in mock data" }],
          },
        },
        { status: 400 },
      );
    }

    const flowSteps = getFlowStepOptionsForFlow(
      foundProcess!,
      validatedFlowName,
    );

    return NextResponse.json({
      message: "Successfully fetched flowsteps",
      results: {
        flowSteps: flowSteps,
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
