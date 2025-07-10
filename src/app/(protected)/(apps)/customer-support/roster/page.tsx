"use client";
import { Button } from "@/shadcn/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/shadcn/ui/card";
// import { Icon } from "@lucide/react";
import { useState } from "react";

export default function Roster() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-md p-6 text-center">
        {/* Sad face icon */}
        <CardHeader>
          <div className="text-6xl text-black">
            <span role="img" aria-label="sad-face">
              😔
            </span>
          </div>
        </CardHeader>

        {/* Coming Soon Message */}
        <CardContent>
          <h1 className="text-4xl font-bold">COMING SOON</h1>
        </CardContent>

        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
}
