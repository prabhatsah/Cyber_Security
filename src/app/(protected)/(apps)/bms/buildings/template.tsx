import type { ReactNode } from "react";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
// const menuitems = [
//   {
//     title: "Dashboard",
//     href: "/bms",
//     iconName: "house",

//   },
//   {
//     title: "Alarms & Events",
//     href: "/bms/alarms",
//     iconName: "bell",
//   },
//   {
//     title: "Discovery",
//     href: "/bms/discovery",
//     iconName: "radio-tower",
//   },
//   {
//     title: "Devices List",
//     href: "/bms/deviceList",
//     iconName: "monitor",
//   },
//   {
//     title: "Trend Analysis",
//     href: "/bms/trends",
//     iconName: "chart-line",
//   },
//   {
//     title: "Control Interface",
//     href: "/bms/control",
//     iconName: "sliders",
//   },
//   {
//     title: "Digital Twin",
//     href: "/bms/digital-twin",
//     iconName: "building-2",
//   },
//   {
//     title: "IoT Devices",
//     href: "/bms/iot-devices",
//     iconName: "cpu",
//   },
//   {
//     title: "Warning Devices",
//     href: "/bms/warning-devices",
//     iconName: "triangle-alert",
//   },
//   // {
//   //   title: "Support Tickets",
//   //   href: "/bms/support-tickets",
//   //   iconName: "ticket",
//   // },
//   {
//     title: "Backnet Data",
//     href: "/bms/backnetData",
//     iconName: "file-code",
//   },
//   {
//     title: "Data Analytics",
//     href: "/bms/data-analytics",
//     iconName: "chart-bar",
//   },
//   {
//     title: "Reports",
//     href: "/bms/reports",
//     iconName: "file-chart-column-increasing",
//   },
//   {
//     title: "Predictive Analysis",
//     href: "/bms/predictive",
//     iconName: "brain",
//   },
//   {
//     title: "AI Assistant",
//     href: "/bms/ai-assistant",
//     iconName: "bot",
//   },
//   {
//     title: "User Management",
//     href: "/bms/users",
//     iconName: "users",
//   },
//   {
//     title: "System Config",
//     href: "/bms/config",
//     iconName: "settings",
//   },
//   {
//     title: "Building Management",
//     href: "/bms/building-management",
//     iconName: "building",
//   }
//   /*{
//     title: "Security",
//     href: "/bms/security",
//     iconName: "shield",
//   },*/
// ];
const menuitems = [
  {
    title: "Dashboard",
    href: "/bms",
    iconName: "house",
  },
  {
    title: "Buildings",
    href: "/bms/buildings",
    iconName: "building",
  },
  {
    title: "Analytics",
    href: "/bms/analytics",
    iconName: "chart-line",
  },
  {
    title: "Reports",
    href: "/bms/reports",
    iconName: "file-chart-column-increasing",
  },
  // {
  //   title: "OnBoarding",
  //   href: "/bms/onboarding",
  //   iconName: "radio-tower",
  // },
//   {
//     title: "Settings",
//     href: "/bms/settings",
//     iconName: "cog",
//   },
//   {
//     title: "BUILDINGS",
//     href: "",
//     iconName: "",
//   },
//  {
//      title: "Building A",
//      submenu: [
//        {
//          title: "Floor 1",
//          iconName: "layers",
//          href: "/bms/buildings/building-a/floors/floor-1",
//        },
//        {
//          title: "Floor 2",
//          iconName: "layers",
//          href: "/bms/buildings/building-a/floors/floor-2",
//        },
//         {
//           title: "Floor 3",
//           iconName: "layers",
//           href: "/bms/buildings/building-a/floors/floor-3",
//         },
//      ]
//    },
//    {
//     title: "Building B",
//     submenu: [
//       {
//         title: "Floor 1",
//         iconName: "layers",
//         href: "/bms/buildings/building-b/floors/floor-1",
//       },
//       {
//         title: "Floor 2",
//         iconName: "layers",
//         href: "/bms/buildings/building-b/floors/floor-2",
//       },
//        {
//          title: "Floor 3",
//          iconName: "layers",
//          href: "/bms/buildings/building-b/floors/floor-3",
//        },
//     ]
//   },
//   {
//     title: "Building C",
//     submenu: [
//       {
//         title: "Floor 1",
//         iconName: "layers",
//         href: "/bms/buildings/building-c/floors/floor-1",
//       },
//       {
//         title: "Floor 2",
//         iconName: "layers",
//         href: "/bms/buildings/building-c/floors/floor-2",
//       },
//        {
//          title: "Floor 3",
//          iconName: "layers",
//          href: "/bms/buildings/building-c/floors/floor-3",
//        },
//     ]
//   },
];
function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
        <RenderAppSidebar menuItems={menuitems} />
        {children}
    </>
  );
}

export default layout;
