import { Grip } from "lucide-react";

import { ModeToggle } from "./ui/Themebutton";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        <Grip className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-5">
        <ModeToggle />
        <span className="text-sm font-medium">Logout</span>
      </div>
    </nav>
  );
}
