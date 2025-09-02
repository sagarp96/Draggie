"use client";

import { useUserAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions";

export default function AuthTestPage() {
  const { data: user, isLoading, error } = useUserAuth();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>

      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </div>

        <div>
          <strong>Error:</strong> {error ? error.message : "None"}
        </div>

        <div>
          <strong>User:</strong> {user ? "Authenticated" : "Not authenticated"}
        </div>

        {user && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-semibold mb-2">User Details:</h3>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Name:</strong> {user.user_metadata?.name || "Not set"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
        )}

        <div className="space-x-4 mt-6">
          {user ? (
            <Button onClick={() => logout()}>Logout</Button>
          ) : (
            <Button onClick={() => (window.location.href = "/login")}>
              Login
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/Welcomepage")}
          >
            Welcome Page
          </Button>
        </div>
      </div>
    </div>
  );
}
