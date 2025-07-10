"use client";
import  { useState } from "react";
import EditLeadModal from ".";

interface EditLeadModalWrapperProps {
  leadIdentifier: string;
}

const EditLeadModalWrapper: React.FC<EditLeadModalWrapperProps> = ({ leadIdentifier }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Only handle modal state here */}
      <EditLeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        leadIdentifier={leadIdentifier}
      />
    </>
  );
};

export default EditLeadModalWrapper;
