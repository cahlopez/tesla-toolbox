import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: Invalidates the current session by clearing the session cookie and returns a success message.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 */

export async function POST() {
  // Create the response
  const response = NextResponse.json(
    { success: true, message: "Successfully logged out" },
    { status: 200 },
  );

  // Delete the session cookie
  response.cookies.set({
    name: "session",
    value: "",
    httpOnly: true,
    secure: true,
    expires: new Date(0), // Set expiration to past date to delete the cookie
    sameSite: "lax",
    path: "/",
  });

  return response;
}
