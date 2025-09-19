"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LogOut, Settings, Shield, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-64 border-r bg-background flex flex-col">
      <div className="h-16 border-b flex items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <span className="text-xl font-bold">SecureVault</span>
        </Link>
      </div>
      <div className="flex-1 py-4 px-3 space-y-1">
        <Link href="/dashboard">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <FileText className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        <Link href="/upload">
          <Button
            variant={pathname === "/upload" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            variant={pathname === "/settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </div>
      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/">
            <LogOut className="mr-2 h-5 w-5" />
            Log out
          </Link>
        </Button>
      </div>
    </div>
  );
}
