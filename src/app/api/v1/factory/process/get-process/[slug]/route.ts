import { processSchema, thingNameSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROCESSES, getFlowOptionsForProcess } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/factory/process/get-process/{slug}:
 *   get:
 *     summary: Get non-production flows for a process
 *     description: Retrieves all non-production flows for a specified process name
 *     tags:
 *       - Factory
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Process name to get flows for
 *         example: "PROCESS_001"
 *     responses:
 *       200:
 *         description: Non-production flows retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched flows"
 *                 results:
 *                   type: object
 *                   properties:
 *                     flows:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: Array of non-production flows
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

    const validatedProcessName = processSchema.parse(slug);

    // Mock implementation - simulate API call
    const process =
      MOCK_PROCESSES[validatedProcessName as keyof typeof MOCK_PROCESSES];
    if (!process) {
      return NextResponse.json(
        {
          error: "Process not found in mock data",
          results: {
            failed: [{ error: "Process not found in mock data" }],
          },
        },
        { status: 400 },
      );
    }

    const flows = getFlowOptionsForProcess(validatedProcessName);

    return NextResponse.json({
      message: "Successfully fetched flows",
      results: {
        flows: flows,
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
