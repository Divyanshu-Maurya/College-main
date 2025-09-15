import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-[#f7f8fb] to-[#eef1f6] text-foreground",
      )}
    >
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-indigo-200" />
            <div>
              <p className="text-sm text-muted-foreground leading-none">
                Principal
              </p>
              <h1 className="text-lg font-semibold tracking-tight">
                Dashboard
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Realtime attendance synced
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="container py-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} CampusTrack • All rights reserved
      </footer>
    </div>
  );
}
