"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const { data: user, isLoading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/Welcomepage");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Draggie</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Draggie</h1>
          <p className="text-gray-600">Redirecting to welcome page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
