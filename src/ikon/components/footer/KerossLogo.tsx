"use client";
import Image from "next/image";
import React from "react";
import { useThemeOptions } from "../theme-provider";

function KerossLogo() {
  const { state } = useThemeOptions();
  const kerossLogoSrc =
    state.mode === "dark"
      ? "/assets/images/dark/keross-logo.png"
      : "/assets/images/light/keross-logo.png";
  return (
    <>
      <Image
        src={process.env.NEXT_BASE_PATH + kerossLogoSrc}
        alt="Keross"
        width={80}
        height={15}
      />
    </>
  );
}

export default KerossLogo;
