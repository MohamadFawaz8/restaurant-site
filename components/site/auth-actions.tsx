"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthActions() {
  const { data } = useSession();

  if (!data?.user) {
    return (
      <Button asChild variant="secondary" aria-label="Login">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      aria-label="Logout"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Logout
    </Button>
  );
}


