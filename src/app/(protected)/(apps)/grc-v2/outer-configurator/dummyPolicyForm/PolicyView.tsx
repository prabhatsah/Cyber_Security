// src/app/components/PolicyView.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import PolicyFormDialog from "./PolicyFormDialog";
import PolicyDisplayCard from "./PolicyDisplayCard";
import type { FullFormData } from "./PolicyForm";
import NoDataComponent from "@/ikon/components/no-data";

type PolicyViewProps = {
  initialPolicies: FullFormData[];
};

export default function PolicyView({ initialPolicies }: PolicyViewProps) {
  // State is managed here, in the client component
  const [policies, setPolicies] = useState<FullFormData[]>(initialPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<FullFormData | null>(null);

  // Handler to open the dialog for creating a new policy
  const handleOpenCreateDialog = () => {
    setEditingPolicy(null); // Ensure no data is pre-filled
    setIsDialogOpen(true);
  };

  // Handler to open the dialog for editing an existing policy
  const handleOpenEditDialog = (policy: FullFormData) => {
    setEditingPolicy(policy); // Set the policy to be edited
    setIsDialogOpen(true);
  };

  // Handler for saving the policy (either new or edited)
  const handleSavePolicy = (updatedPolicy: FullFormData) => {
    // NOTE: Here you would typically make an API call to persist the changes.
    // For this example, we'll just update the client-side state.
    console.log("Saving policy:", updatedPolicy);

    if (editingPolicy) {
      // Logic to update an existing policy in the list
      setPolicies(
        policies.map((p) =>
          p.policyTitle === editingPolicy.policyTitle ? updatedPolicy : p
        )
      );
    } else {
      // Logic to add a new policy to the list
      setPolicies([...policies, updatedPolicy]);
    }

    setEditingPolicy(null); // Reset editing state
  };

  return (
    <div className="p-4 md:p-8 bg-muted/20 h-full">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">
            Policy Dashboard
          </h1>
          <p className="text-muted-foreground">
            View existing policies or create a new one.
          </p>
        </div>
        {/* This button opens the dialog via state change */}
        <Button onClick={handleOpenCreateDialog}>Create New Policy</Button>
      </header>

      <main className="h-full">
        {policies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {policies.map((policy, index) => (
              <PolicyDisplayCard
                key={index}
                policy={policy}
                onEdit={handleOpenEditDialog} // Pass the edit handler to each card
              />
            ))}
          </div>
        ) : (
          <div className="h-[90%]">
            <NoDataComponent />
          </div>
        )}
      </main>

      {/* The Dialog is rendered here and controlled by this component's state */}
      <PolicyFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePolicy}
        editPolicyData={editingPolicy}
      />
    </div>
  );
}