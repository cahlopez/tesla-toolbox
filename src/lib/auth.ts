"use server";

import { cookies } from "next/headers";
const { decrypt } = await import("./session");

export async function getUserCookie() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);
  return session;
}
