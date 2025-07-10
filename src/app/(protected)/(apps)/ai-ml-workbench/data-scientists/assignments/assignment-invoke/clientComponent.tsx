"use client";

import { useState, useEffect } from "react";
import AssigneeModal from "./updateAssigneeForm";

interface ClientAssigneeModalProps {
  assignmentId: string;
  assignmentName: string;
  assignees: { id: string; name: string }[];
  onClose: () => void;
  assignmentData: any;
}

const ClientAssigneeModal = ({
  assignmentId,
  assignmentName,
  assignees,
  onClose,
  assignmentData,
}: ClientAssigneeModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Reset modal open state when a new assignment is selected
  useEffect(() => {
    setTimeout(() => setIsModalOpen(true), 0);
  }, [assignmentId]); // Runs every time assignmentId changes

  const handleClose = () => {
    setIsModalOpen(false);
    onClose(); // Ensure parent also handles modal close
  };

  const handleAssign = (assignmentId: string, assigneeId: string) => {
    console.log(`Assignment ${assignmentId} assigned to ${assigneeId}`);
    setIsModalOpen(false);
    onClose(); // Ensure parent updates state
  };

  return (
    <AssigneeModal
      show={isModalOpen}
      onClose={handleClose}
      assignmentId={assignmentId}
      assignmentName={assignmentName}
      assignees={assignees}
      onAssign={handleAssign}
      assignmentData={assignmentData}
    />
  );
};

export default ClientAssigneeModal;
