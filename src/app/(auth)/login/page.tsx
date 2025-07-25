import LoginForm from "./login-form";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (session) {
    redirect("/");
  }

  return (
    <main className="bg-background/40 flex min-h-screen items-center justify-center bg-[url('/robovan2.webp')] bg-cover bg-center bg-blend-overlay">
      <div className="bg-card/90 w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">NPI Login</h1>
          <p className="text-muted-foreground mt-2">
            Please sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
