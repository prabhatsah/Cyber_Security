"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/shadcn/lib/utils";

const Tabs = TabsPrimitive.Root;
type TabsListVariant = "line" | "solid";
const TabsListVariantContext = React.createContext<TabsListVariant>("line");

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsListVariant;
}

const variantStyles: Record<TabsListVariant, string> = {
  line: cn(
    "flex items-center border-b border-gray-200 dark:border-gray-800 space-x-6"
  ),
  solid: cn(
    "inline-flex items-center rounded-md p-1 bg-gray-100 dark:bg-gray-900"
  ),
};

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "line", children, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(variantStyles[variant], className)}
    {...props}
  >
    <TabsListVariantContext.Provider value={variant}>
      {children}
    </TabsListVariantContext.Provider>
  </TabsPrimitive.List>
));

TabsList.displayName = "TabsList";

const getVariantStyles = (tabVariant: TabsListVariant) => {
  switch (tabVariant) {
    case "line":
      return cn(
        // base
        "-mb-px items-center justify-center whitespace-nowrap border-b-4 border-transparent px-3 pb-2 text-sm font-medium transition-all",
        // text color
        "text-gray-500 dark:text-gray-500",
        // hover
        "hover:text-gray-700 hover:dark:text-gray-400",
        // border hover
        "hover:border-gray-300 hover:dark:border-gray-400",
        // selected
        "data-[state=active]:border-accent data-[state=active]:text-foreground",
        "data-[state=active]:dark:border-accent data-[state=active]:dark:text-foreground",
        // disabled
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:text-gray-300 data-[disabled]:dark:text-gray-700"
      );
    case "solid":
      return cn(
        // base
        "inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-sm font-medium ring-1 ring-inset transition-all",
        // text color
        "text-gray-500 dark:text-gray-400",
        // hover
        "hover:text-gray-700 hover:dark:text-gray-200",
        // ring
        "ring-transparent",
        // selected
        "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow",
        "data-[state=active]:dark:bg-gray-950 data-[state=active]:dark:text-gray-50",
        // disabled
        "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[disabled]:opacity-50 data-[disabled]:dark:text-gray-600"
      );
  }
};


const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const tabVariant = React.useContext(TabsListVariantContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(getVariantStyles(tabVariant), className)}
      {...props}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
