"use client";

import Dashboard from "@/app/dashboard/components/Dashboard";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import setBreadcrumb from "@/lib/setBreadcrumb";
import { getSocket } from '@/utils/webSocketComponent';
import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   const socket = getSocket();
  //   console.log('inside first useEffect')

  //   socket.on('connect', () => {
  //     console.log('Socket connected:', socket.id);
  //   });

  //   const onCustomMessage = (data: any) => {
  //     console.log('📨 Received from socket:', data);
  //   };

  //   socket.on('custom_event', onCustomMessage);

  //   return () => {
  //     socket.off('custom_event', onCustomMessage);
  //     socket.off('connect');
  //   };
  // }, []);

  return <>
    <RenderAppBreadcrumb
      breadcrumb={{
        level: 0,
        title: "Dashboard",
        href: "/dashboard",
      }}
    />
    <Dashboard />
  </>;
}
