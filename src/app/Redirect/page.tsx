"use client";
import { CheckUserExist } from "@/hooks/query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generaterandomColor } from "@/lib/data/Taskcolor";
import { AddUser } from "@/hooks/Mutate";
import { useUserAuth } from "@/hooks/useAuth";

export default function Redirectpage() {
  const checkUserExistYES = CheckUserExist();
  const { data: user, isLoading } = useUserAuth();
  const AddUserMutation = AddUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;

    if (checkUserExistYES.data === undefined) {
      return;
    }

    if (checkUserExistYES.data?.length === 0) {
      console.log("User Not Exist");
      AddUserMutation.mutate({
        id: user.id,
        color: generaterandomColor(),
        username: user.user_metadata.name,
      });
      router.replace("/Welcomepage");
    } else {
      console.log("User Exist");
      router.replace("/Welcomepage");
    }
  }, [checkUserExistYES.data, AddUserMutation, user, isLoading, router]);

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
