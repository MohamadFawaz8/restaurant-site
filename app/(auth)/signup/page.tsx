import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignupForm } from "@/app/(auth)/signup/signup-form";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (role === "ADMIN" || role === "STAFF") redirect("/admin");
  if (role === "USER") redirect("/");

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 h-12 w-12 rounded-2xl border border-border bg-background/70 backdrop-blur" aria-hidden />
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join M&amp;N to save reservations and get updates.
        </p>
      </div>

      <SignupForm />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="text-foreground underline underline-offset-4 hover:opacity-80" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}


