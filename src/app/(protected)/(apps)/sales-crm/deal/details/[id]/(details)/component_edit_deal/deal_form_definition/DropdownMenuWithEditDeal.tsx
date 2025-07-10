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
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { Ellipsis, SquarePenIcon } from "lucide-react";
import { SquarePlusIcon } from "lucide-react";
import EditDealModal from ".";
//import EditLeadModalWrapper from "./EditLeadModalWrapper";
// import EditLeadModal from ".";
//import EditTeamDetailsModal from "../../components_edit_team_details/team_data_definition";

interface DropdownMenuWithEditDealProps {
  dealIdentifier: string;
}

const DropdownMenuWithEditDeal: React.FC<DropdownMenuWithEditDealProps> = ({dealIdentifier,}) => {
  const { openDialog } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //const [isModalOpenTeam, setIsModalOpenTeam] = useState(false);

  // const handleOpenModalEditTeam = () => {
  //   setIsModalOpenTeam(true);
  // };
  const handleOpenModalEditTeam = () => {
    openDialog({
      title: "Update Team",
      description: "You can only link this deal to issue tracker if the data of Schedule has been entered. Please fill the Schedule and then try again",
      confirmText: "Okay",
      onConfirm: () => console.log("Confirmed action executed!"),
    });
  };

  // const handleCloseModalEditTeam = () => {
  //   setIsModalOpenTeam(false);
  // };

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
              <span>Update Team</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleOpenModal}>
              <SquarePenIcon />
              <span>Edit Deal</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditDealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dealIdentifier={dealIdentifier}
      />
      {/* <EditTeamDetailsModal
        isOpen={isModalOpenTeam}
        onClose={handleCloseModalEditTeam}
        leadIdentifier={leadIdentifier}
      />   */}
    </>
  );
};

export default DropdownMenuWithEditDeal;
