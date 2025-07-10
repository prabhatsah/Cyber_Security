"use client"; // Mark this as a client component
import { FaTimes } from "react-icons/fa"; 
import { useState } from "react";
import PieChartCard from "./components/PieChartCard";
import PieChart from "./components/PieChart";
import OpenTicketsDatatable from "../components/ticket-datatable";
import { TicketData } from "../components/type";
import BarChart from "./components/BarChart";
import Card from "./components/Card";
import TicketFrequencyChart from "./components/StackedBarChart";

interface SummaryClientWrapperProps {
  typeChartData: { label: string; value: number }[];
  priorityChartData: { label: string; value: number }[];
  statusChartData: { label: string; value: number }[];
  accountChartData: { label: string; value: number }[];
  infraChartData: { label: string; value: number }[];
  typeGrouped: Record<string, TicketData[]>;
  priorityGrouped: Record<string, TicketData[]>;
  statusGrouped: Record<string, TicketData[]>;
  accountGrouped: Record<string, TicketData[]>;
  infraGrouped: Record<string, TicketData[]>;
  priorityWiseTicketInfo: TicketData[];
}

type TableSection = "top" | "middle" | "bottom" | null;

export default function SummaryClientWrapper({
  typeChartData,
  priorityChartData,
  statusChartData,
  accountChartData,
  infraChartData,
  typeGrouped,
  priorityGrouped,
  statusGrouped,
  accountGrouped,
  infraGrouped,
  priorityWiseTicketInfo,
}: SummaryClientWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<TicketData[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedTableSection, setSelectedTableSection] = useState<TableSection>(null);

  const handleDismiss = () => {
    setSelectedTableSection(null); // Dismiss the table
  };

  const handlePieChartClick = (category: string) => {
    setSelectedCategory(category);
    if (typeGrouped[category]) {
      setSelectedTickets(typeGrouped[category]);
      setSelectedSection("Type");
      setSelectedTableSection("top"); // Show top table
    } else if (priorityGrouped[category]) {
      setSelectedTickets(priorityGrouped[category]);
      setSelectedSection("Severity");
      setSelectedTableSection("top"); // Show top table
    } else if (statusGrouped[category]) {
      setSelectedTickets(statusGrouped[category]);
      setSelectedSection("Status");
      setSelectedTableSection("top"); // Show top table
    } else if (accountGrouped[category]) {
      setSelectedTickets(accountGrouped[category]);
      setSelectedSection("Account");
      setSelectedTableSection("middle"); // Show middle table
    } else if (infraGrouped[category]) {
      setSelectedTickets(infraGrouped[category]);
      setSelectedSection("Infrastructure");
      setSelectedTableSection("middle"); // Show middle table
    }
  };

  const handleBarChartClick = (label: string) => {
    setSelectedCategory(label);
    if (infraGrouped[label]) {
      setSelectedTickets(infraGrouped[label]);
      setSelectedSection("Infrastructure");// Show bottom table
      setSelectedTableSection("middle");
    }
  };

  const handleTicketFrequencyChartClick = (label: string) => {
    const hour = parseInt(label.split(":")[0]); // Extract the hour from the label
    const filteredTickets = priorityWiseTicketInfo.filter((ticket) => {
      const ticketHour = new Date(ticket.dateCreated).getHours();
      return ticketHour === hour;
    });

    setSelectedCategory(label);
    setSelectedTickets(filteredTickets);
    setSelectedSection("Ticket Frequency");
    setSelectedTableSection("bottom"); // Show bottom table
  };

  return (
    <div className="grow overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <PieChartCard title="By Type" legendData={typeChartData}>
          <PieChart data={typeChartData} onSectionClick={handlePieChartClick} />
        </PieChartCard>
        <PieChartCard title="By Severity" legendData={priorityChartData}>
          <PieChart
            data={priorityChartData}
            onSectionClick={handlePieChartClick}
          />
        </PieChartCard>
        <PieChartCard title="By Status" legendData={statusChartData}>
          <PieChart
            data={statusChartData}
            onSectionClick={handlePieChartClick}
          />
        </PieChartCard>
      </div>

      {/* Top Table */}
      {selectedTableSection === "top" && selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
          <div className="md:col-span-12">
            <Card
              title={`${selectedSection} - ${selectedCategory}`}
              tools={
                <div className="cursor-pointer" onClick={handleDismiss} title="Dismiss">
                  <FaTimes size={20} color="white" />
                </div>
              }
            >
              <OpenTicketsDatatable ticketData={selectedTickets} />
            </Card>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
        <div className="md:col-span-4">
          <PieChartCard title="By Account" legendData={accountChartData}>
            <PieChart
              data={accountChartData}
              onSectionClick={handlePieChartClick}
            />
          </PieChartCard>
        </div>

        <div className="md:col-span-8">
          <Card title="By Infrastructure">
            <div className="w-full h-full">
              <BarChart data={infraChartData} onBarClick={handleBarChartClick} />
            </div>
          </Card>
        </div>
      </div>

      {/* Middle Table */}
      {selectedTableSection === "middle" && selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
          <div className="md:col-span-12">
            <Card
              title={`${selectedSection} - ${selectedCategory}`}
              tools={
                <div className="cursor-pointer" onClick={handleDismiss} title="Dismiss">
                  <FaTimes size={20} color="white" />
                </div>
              }
            >
              <OpenTicketsDatatable ticketData={selectedTickets} />
            </Card>
          </div>
        </div>
      )}

<div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-3"> {/* Increased gap */}
  <div className="md:col-span-12">
    <TicketFrequencyChart
      ticketData={priorityWiseTicketInfo}
      onBarClick={handleTicketFrequencyChartClick}
    />
  </div>
</div>

      {/* Bottom Table */}
      {selectedTableSection === "bottom" && selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
          <div className="md:col-span-12">
            <Card
              title={`${selectedSection} - ${selectedCategory}`}
              tools={
                <div className="cursor-pointer" onClick={handleDismiss} title="Dismiss">
                  <FaTimes size={20} color="white" />
                </div>
              }
            >
              <OpenTicketsDatatable ticketData={selectedTickets} showCreateTicket={false} showExtraParam={false} showActionBtn={false}/>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
