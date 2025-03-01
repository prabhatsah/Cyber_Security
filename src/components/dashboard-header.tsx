"use client";

import { Shield } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">AI-IDS</h1>
              <p className="text-sm text-muted-foreground">
                Intrusion Detection System
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
