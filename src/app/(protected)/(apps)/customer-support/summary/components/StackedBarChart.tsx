"use client";
import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import { TicketData } from "../../components/type";
import Card from "./Card";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "./DatePickerWithRange";

interface TicketFrequencyChartProps {
  ticketData: TicketData[]; // Ensure ticketData is an array
  onBarClick: (label: string) => void;
}

export default function TicketFrequencyChart({
  ticketData = [], // Default to an empty array
  onBarClick,
}: TicketFrequencyChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // Default to last 7 days
    to: new Date(),
  });

  // Filter tickets based on the selected date range
  const filteredTickets = useMemo(() => {
    if (!ticketData || !Array.isArray(ticketData)) {
      return []; // Return an empty array if ticketData is undefined or not an array
    }
    return ticketData.filter((ticket) => {
      const ticketDate = new Date(ticket.dateCreated);
      return dateRange?.from && dateRange?.to && ticketDate >= dateRange.from && ticketDate <= dateRange.to;
    });
  }, [ticketData, dateRange]);

  // Group tickets by hour
  const groupedData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);
    return hours.map((hour, index) => {
      const ticketCount = filteredTickets.filter(
        (ticket) => new Date(ticket.dateCreated).getHours() === index
      ).length;
      return {
        label: hour,
        value: ticketCount,
      };
    });
  }, [filteredTickets]);

  // ECharts configuration
  const options: EChartsOption = {
    xAxis: {
      type: "category", // Explicitly set the type to "category"
      data: groupedData.map((item) => item.label),
      axisLabel: {
        color: "#fff", // White text for x-axis labels
      },
    },
    yAxis: {
      type: "value", // Explicitly set the type to "value"
      axisLabel: {
        color: "#fff", // White text for y-axis labels
      },
    },
    series: [
      {
        data: groupedData.map((item) => item.value),
        type: "bar",
        itemStyle: {
          color: "#facc15", // Bar color
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow", // Show tooltip on hover
      },
    },
  };

  // Handle click events
  const onChartClick = (params: any) => {
    if (params.componentType === "series" && params.dataIndex !== undefined) {
      const clickedLabel = groupedData[params.dataIndex].label;
      onBarClick(clickedLabel); // Pass the clicked label to the parent component
    }
  };

  return (
    <div className="text-white">
      <Card
        title="Ticket Generation Frequency"
        tools={
          <div className="flex gap-4 items-center">
            <DatePickerWithRange
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        }
      >
        <div className="w-full h-full flex justify-center items-center">
      {/* Wider container */}
      <div className="w-full" style={{ height: "300px", width: "100%" }}>
          <ReactECharts
            option={options}
            style={{ height: "100%", width: "100%" }}
            onEvents={{
              click: onChartClick, // Attach the click event handler
            }}
          />
        </div></div>
      </Card>
    </div>
  );
}