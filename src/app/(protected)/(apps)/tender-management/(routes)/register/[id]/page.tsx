// "use client";
// import { Button } from "@/shadcn/ui/button";
// import { use, useEffect, useState } from "react";

import RegistrationDetails from "../../../_components/register/registration-details-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  
  const supplierId = (await params)?.id ?? null;

  return (
    <>
      <RegistrationDetails supplierId={supplierId} />
    </>
  );
  // redirect(`/sales-crm/lead/details/${leadIdentifier}/event-tab`)
}
