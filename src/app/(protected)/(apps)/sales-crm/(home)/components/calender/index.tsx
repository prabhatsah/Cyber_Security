"use client"
import React, { useState } from "react";
import AddEventForm from "../add-event-form";
import { BigCalendarEventProps, ExtraParamsEvent } from "@/ikon/components/big-calendar/type";
import BigCalendar from "@/ikon/components/big-calendar";
import EditEventForm from "../../../components/event-component/edit-event/EditEventModalForm";

export default function Calendar({ events }: { events: BigCalendarEventProps[] }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

  const handleEventEditClick = (event: BigCalendarEventProps) => {
    setSelectedEventId(event.id);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedEventId(undefined);
  };

  const extraParamsEvent: ExtraParamsEvent = {
    defaultView: "month",
    isEditableAll: true,
    onEditEventClick: handleEventEditClick, 
  };

  const extraTools = [<AddEventForm key="add-event-form" />];

  return (
    <>
      <BigCalendar events={events} extraParamsEvent={extraParamsEvent} extraTools={extraTools} />
      <EditEventForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} eventId={selectedEventId} />
    </>
  );
}
