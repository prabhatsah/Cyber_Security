"use client";

import BigCalendar from "@/ikon/components/big-calendar";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import EventForm from "../../../../components/event-component";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import EditEventForm from "../../../../components/event-component/edit-event/EditEventModalForm";

interface LeadEventProps {
  leadIdentifier: string;
  eventData: any[];
}

export default function LeadEvent({ leadIdentifier, eventData }: LeadEventProps) {
  const { openDialog } = useDialog();
  const [isEventModalOpen, setEventModalOpen] = useState(false);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

  // const handleEventEditClick = (event: any) => {
  //   openDialog({
  //     title: `Edit Event: ${event.title}`,
  //     description: "You can edit this event.",
  //     confirmText: "Okay",
  //     onConfirm: () => console.log("Edit confirmed."),
  //   });
  // };
  const handleEventEditClick = (event: { id: string;[key: string]: any }) => {
    setSelectedEventId(event.id);
    setEditModalOpen(true);
  };


  const handleEventViewClick = (event: any) => {
    openDialog({
      title: `View Event: ${event.title}`,
      description: "Here are the event details.",
      confirmText: "Okay",
      onConfirm: () => console.log("View confirmed."),
    });
  };

  const extraParamsEvent = {
    defaultView: "month",
    onEventClick: handleEventEditClick,
    onViewClick: handleEventViewClick,
  };

  const extraToolbarButtons = {
    buttonName: "Add Event",
    buttonIcon: <Plus />,
    onClick: () => setEventModalOpen(true),
    id: "add-event-button",
  };

  const handleCloseEventModal = () => {
    setEventModalOpen(false);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedEventId(undefined); // Clear the selected event ID
  };

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 5,
          title: "Events",
          href: `/sales-crm/lead/details/${leadIdentifier}/event`,
        }}
      />
      <BigCalendar events={eventData} extraParamsEvent={extraParamsEvent} extraToolbarButtons={extraToolbarButtons} />
      <EventForm isOpen={isEventModalOpen} onClose={handleCloseEventModal} source="Lead" indentifier={leadIdentifier} />
      <EditEventForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} eventId={selectedEventId} />
    </>
  );
}
