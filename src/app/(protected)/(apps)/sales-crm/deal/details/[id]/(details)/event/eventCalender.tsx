'use client';
import { eventData } from "@/app/(protected)/examples/calendar/data";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import BigCalendar from "@/ikon/components/big-calendar";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import EventForm from "@/app/(protected)/(apps)/sales-crm/components/event-component";
import EditEventForm from "@/app/(protected)/(apps)/sales-crm/components/event-component/edit-event/EditEventModalForm";

interface DealEventProps {
    dealIdentifier: string;
    eventData: any[];
}

export default function DealEvent({ dealIdentifier, eventData }: DealEventProps) {
    const { openDialog } = useDialog();
    const [isEventModalOpen, setEventModalOpen] = useState(false);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

    // const handleEventEditClick = () => {
    //     <Modal
    //         title="Event Edit clicked"
    //         description="This event has been clicked for editing!"
    //         confirmText="Okay"
    //         onConfirm={() => console.log("Confirmed action executed!")}
    //         onClose={function (): void {
    //             throw new Error("Error!!!");
    //         }}
    //     />;

    //     openDialog({
    //         title: "Event Edit clicked",
    //         description: "This event has been clicked for editing!",
    //         confirmText: "Okay",
    //         onConfirm: () => console.log("Confirmed action executed!"),
    //     });
    // };
    const handleEventEditClick = (event: { id: string;[key: string]: any }) => {
        setSelectedEventId(event.id);
        setEditModalOpen(true);
    };

    const handleEventViewClick = () => {
        openDialog({
            title: "Event View clicked",
            description: "This event has been viewed!",
            confirmText: "Okay",
            onConfirm: () => console.log("Confirmed action executed!"),
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
                    title: 'Events',
                    href: `/sales-crm/deal/details/${dealIdentifier}/event`,
                }}
            />
            <BigCalendar events={eventData} extraParamsEvent={extraParamsEvent} extraToolbarButtons={extraToolbarButtons} />
            <EventForm isOpen={isEventModalOpen} onClose={handleCloseEventModal} source="Deal" identifier={dealIdentifier} />
            <EditEventForm isOpen={isEditModalOpen} onClose={handleCloseEditModal} eventId={selectedEventId} />
        </>

    );
}