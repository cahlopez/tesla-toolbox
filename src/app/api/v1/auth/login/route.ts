import { NextResponse } from "next/server";
import { decodeJwtPayload } from "@/lib/utils";
import { encrypt } from "@/lib/session";
import { validateMockCredentials } from "@/lib/mock-data";

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     description: Sends credentials to the Factory API to validate user and return a JWT token.
 *                 The token is required for subsequent API calls. Rate limited to 5 attempts per minute.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       302:
 *         description: Successfully authenticated and redirected to home page
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "session=encrypted_session_data; HttpOnly; Secure; SameSite=Lax; Path=/"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid username or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const authResult = validateMockCredentials(username, password);

    if (!authResult) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Create the session token
    const nowMilliseconds = new Date().getTime();
    const nowSeconds = Math.floor(nowMilliseconds / 1000);
    const expiresAt = Math.floor(nowSeconds + 720 * 60);

    const session = await encrypt({
      userId: authResult.user.userId as string,
      username: authResult.user.username as string,
      token: authResult.token,
    });

    // Create the redirect response
    const response = NextResponse.redirect(new URL("/", request.url));

    // Set the cookie
    response.cookies.set({
      name: "session",
      value: session,
      httpOnly: true,
      secure: true,
      expires: new Date(expiresAt * 1000),
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
