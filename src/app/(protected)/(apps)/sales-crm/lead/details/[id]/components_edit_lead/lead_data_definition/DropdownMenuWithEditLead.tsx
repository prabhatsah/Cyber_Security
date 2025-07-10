"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/shadcn/ui/dropdown-menu";
import { Button } from "@/shadcn/ui/button";
import { Ellipsis, SquarePenIcon } from "lucide-react";
import { SquarePlusIcon } from "lucide-react";
import EditLeadModalWrapper from "./EditLeadModalWrapper";
import EditLeadModal from ".";
import EditTeamDetailsModal from "../../components_edit_team_details/team_data_definition";

interface DropdownMenuWithEditLeadProps {
  leadIdentifier: string;
}

const DropdownMenuWithEditLead: React.FC<DropdownMenuWithEditLeadProps> = ({
  leadIdentifier,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [isModalOpenTeam, setIsModalOpenTeam] = useState(false);

  const handleOpenModalEditTeam = () => {
    setIsModalOpenTeam(true);
  };

  const handleCloseModalEditTeam = () => {
    setIsModalOpenTeam(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="smallIcon">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleOpenModalEditTeam}>
              <SquarePlusIcon />
              <span>Add / Edit Team</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleOpenModal}>
              <SquarePenIcon />
              <span>Edit Lead</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditLeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        leadIdentifier={leadIdentifier}
      /> 
      <EditTeamDetailsModal
        isOpen={isModalOpenTeam}
        onClose={handleCloseModalEditTeam}
        leadIdentifier={leadIdentifier}
      />  
    </>
  );
};

export default DropdownMenuWithEditLead;
