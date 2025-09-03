"use client";
import { Grip } from "lucide-react";
import { ModeToggle } from "./ui/Themebutton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { useUserAuth } from "@/hooks/useAuth";
import { logout } from "@/app/login/actions";
import { useState } from "react";

export default function Navbar() {
  const { data: user, isLoading } = useUserAuth() || {};
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const signoutUser = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // In case of logout failure, force redirect to home page
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderUserAvatar = () => {
    if (!user || isLoading) {
      return null;
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {user?.user_metadata?.name?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase() ||
                "U"}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-60 mr-5 flex justify-end place-content-end flex-col">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm font-medium">
              {user?.user_metadata?.name ||
                user?.email?.split("@")[0] ||
                "User"}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <Button
              onClick={signoutUser}
              variant="outline"
              className="hover:bg-transparent"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        <Grip className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-5">
        {renderUserAvatar()}
        <ModeToggle />
      </div>
    </nav>
  );
}
