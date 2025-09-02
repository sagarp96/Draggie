"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">
          There was an error with your authentication. Please try again.
        </p>
        <div className="space-x-4">
          <Button onClick={() => router.push("/login")}>Back to Login</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
