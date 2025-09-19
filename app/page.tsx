"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-16">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">SecureVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="grid lg:grid-cols-2 gap-6 py-12 lg:py-32 px-16">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Secure Your Files in the Cloud
            </h1>
            <p className="text-lg text-muted-foreground max-w-[600px]">
              Upload files to your AWS S3 bucket with automatic encryption. No
              technical knowledge required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => {
                  signIn("google", { redirectTo: "/dashboard" });
                }}
                size="lg"
                className="px-8"
              >
                Get Started
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square bg-muted rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <div className="size-16 bg-background rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-8"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Drag & Drop Files</h3>
              <p className="text-sm text-muted-foreground">
                Secure encryption made simple
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
