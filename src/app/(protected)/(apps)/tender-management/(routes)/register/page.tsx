"use client";

import { Button } from "@/shadcn/ui/button";
import { useEffect, useState } from "react";
import SupplierRegistrationModal from "../../_components/profile/profile-page/supplier-register-modal";
import { useRouter } from "next/navigation";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getCurrentSupplierId } from "../../_utils/register/supplier-register-form";

const supplierIdTemp = null;

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("fethcing user supplier");
    async function fetchUserSupplier() {
      const supplierId = await getCurrentSupplierId();
      setSupplierId(supplierId);
      console.log("supplier id fetched", supplierId);
    }

    fetchUserSupplier();
  }, []); // Run when router is available

  useEffect(() => {
    if (supplierId !== null) {
      console.log(
        "redirecting to supplier registration",
        `/tender-management/register/${supplierId}`
      );
      router.replace(`/tender-management/register/${supplierId}`);
    }
  }, [supplierId, router]);

  return (
    <>
      {supplierId !== null ? (
        <p className="text-center text-lg">Redirecting...</p>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <Button onClick={() => setIsOpen(true)}>Register as Supplier</Button>
          {isOpen && (
            <SupplierRegistrationModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              supplierId={null}
            />
          )}
        </div>
      )}
    </>
  );
}
