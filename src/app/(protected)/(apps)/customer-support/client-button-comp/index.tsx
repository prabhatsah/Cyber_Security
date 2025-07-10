"use client"; // Required for client-side navigation

import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";

export default function ClientButtonComp ({ 
  variant, 
  className, 
  href, 
  children 
}: { 
  variant?: string; 
  className?: string; 
  href: string; 
  children: React.ReactNode; 
}) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => router.push(href)}
    >
      {children}
    </Button>
  );
}