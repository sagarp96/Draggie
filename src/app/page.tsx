"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/hooks/useAuth";

export default function RootPage() {
  const { data: user, isLoading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace("/Welcomepage");
    } else {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Draggie</h1>
        <p className="text-gray-600">
          {isLoading ? "Checking authentication..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
