"use client";
import { CheckUserExist } from "@/hooks/query";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { generaterandomColor } from "@/lib/data/Taskcolor";
import { AddUser } from "@/hooks/Mutate";
import { useUserAuth } from "@/hooks/useAuth";

export default function Redirectpage() {
  const checkUserExistYES = CheckUserExist();
  const { data: user, isLoading } = useUserAuth();
  const AddUserMutation = AddUser();
  const router = useRouter();
  const hasProcessed = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current || isProcessing) return;

    if (isLoading || !user) return;

    // Wait for the user check query to complete
    if (checkUserExistYES.isLoading || checkUserExistYES.data === undefined) {
      return;
    }

    // Mark as processing to prevent duplicates
    setIsProcessing(true);
    hasProcessed.current = true;

    console.log("User check data:", checkUserExistYES.data);

    if (checkUserExistYES.data?.length === 0) {
      console.log("User doesn't exist, creating profile...");

      AddUserMutation.mutate(
        {
          id: user.id,
          color: generaterandomColor(),
          username:
            user.user_metadata.name || user.email?.split("@")[0] || "User",
        },
        {
          onSuccess: () => {
            console.log("User profile created successfully");
            router.replace("/Welcomepage");
          },
          onError: (error) => {
            console.error("Failed to create user profile:", error);
            // Redirect anyway to prevent getting stuck
            router.replace("/Welcomepage");
          },
        }
      );
    } else {
      console.log("User exists, redirecting to welcome page");
      router.replace("/Welcomepage");
    }
  }, [
    checkUserExistYES.data,
    checkUserExistYES.isLoading,
    AddUserMutation,
    user,
    isLoading,
    router,
    isProcessing,
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Draggie</h1>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (checkUserExistYES.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Draggie</h1>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  if (AddUserMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Draggie</h1>
          <p className="text-gray-600">Creating your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Draggie</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
