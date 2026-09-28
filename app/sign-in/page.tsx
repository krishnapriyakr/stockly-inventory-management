"use client";

import { NeonAuthUIProvider, AuthView } from "@neondatabase/auth-ui";
import "@neondatabase/auth-ui/css";

import { authClient } from "@/lib/auth/client";

export default function SignInPage() {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      social={{ providers: ["google"] }}
      redirectTo="/dashboard"
    >
      <div className="flex min-h-screen w-full items-center justify-center  p-4">
        <AuthView pathname="sign-in" />
      </div>
    </NeonAuthUIProvider>
  );
}