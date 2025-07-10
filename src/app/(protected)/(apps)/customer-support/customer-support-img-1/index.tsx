"use client";
import { useTheme } from "next-themes";
import React from "react";

function OrchestrationImg1() {
  const { resolvedTheme } = useTheme();
  return (
    <img
      alt="Image 1"
      src={
        resolvedTheme == "dark"
          ? "/assets/images/customer-support-dark.png"
          : "/assets/images/customer-support-light.png"
      }
    />
  );
}

export default OrchestrationImg1;
