import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function Navbar({ username }: { username: string | undefined }) {
   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
   return (
      <nav className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-primary">TenantNotes</div>
          </div>
          <DropdownMenu
            open={userDropdownOpen}
            onOpenChange={setUserDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-foreground hover:bg-accent"
                disabled={username === ""}
              >
                {username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
   );
}