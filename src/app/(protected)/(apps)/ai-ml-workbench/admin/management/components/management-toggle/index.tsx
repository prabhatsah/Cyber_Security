"use client";

import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManagementToggle() {
  const [toggleValue, setToggleValue] = useState("");

  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    const pathParts = pathName.split("/");
    console.log(pathParts);
    const value = pathParts[pathParts.length - 1];
    setToggleValue(value == "management" ? "ml-servers" : value);
  }, [pathName]);

  return (
    <>
      <ToggleGroup
        type="single"
        variant="outline"
        value={toggleValue}
        className="justify-start"
        onValueChange={(value: string) => {
          const url = "/ai-ml-workbench/admin/management/" + value;
          router.push(url);
          setToggleValue(value == "management" ? "ml-servers" : value);
        }}
      >
        <ToggleGroupItem className="rounded-e-none" value="ml-servers">
          ML Servers
        </ToggleGroupItem>
        <ToggleGroupItem className="rounded-s-none" value="probes">
          Probes
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
