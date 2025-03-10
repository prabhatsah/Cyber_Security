"use client";

import Link from "next/link";

import { Fragment, useEffect, useMemo, useState } from "react";
import { redirect } from "next/navigation";
import { BreadcrumbItemProps, useBreadcrumb } from "./BreadcrumbProvider";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shadcn/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shadcn/ui/drawer";
import { Button } from "@/shadcn/ui/button";
import { useIsMobile } from "@/shadcn/hooks/use-mobile";

export default function AppBreadcrumb() {
  const { breadcrumbItems, backBreadcrumb } = useBreadcrumb();
  const [open, setOpen] = useState(false);
  const [itemToDisplay, setItemToDisplay] = useState<number>(2);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (isMobile) {
      setItemToDisplay(2);
    } else {
      setItemToDisplay(4);
    }
  }, [isMobile]);

  const breadcrumbObj = useMemo(() => {
    return {
      firstVisibleBreadcrumbList: breadcrumbItems.slice(0, 2),
      hiddenBreadcrumbList: isMobile
        ? breadcrumbItems.slice(2)
        : breadcrumbItems.slice(2, itemToDisplay),
      lastVisibleBreadcrumbList:
        breadcrumbItems.length > 2
          ? breadcrumbItems.slice(
            2 -
            (breadcrumbItems.length < itemToDisplay
              ? breadcrumbItems.length
              : itemToDisplay)
          )
          : [],
    };
  }, [breadcrumbItems, itemToDisplay, isMobile]);

  if (!breadcrumbObj || isMobile == undefined || itemToDisplay == null) {
    return null;
  }
  return (
    <Breadcrumb key={"Breadcrumb1"}>
      <BreadcrumbList key={"BreadcrumbList1"}>
        {breadcrumbObj.firstVisibleBreadcrumbList.map(
          (item: any, index: number) =>
            index < breadcrumbItems.length - 1 ? (
              <Fragment key={"first" + index}>
                <BreadcrumbItem>
                  {!item.href ? (
                    <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                      {item.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      className="max-w-20 truncate md:max-w-none cursor-pointer"
                      onClick={() => {
                        backBreadcrumb(item);
                        redirect(item.href);
                      }}
                    >
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator key={"firstsep" + index} />
              </Fragment>
            ) : (
              <BreadcrumbItem key={"first" + index}>
                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                  {item.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )
        )}

        {breadcrumbItems.length > itemToDisplay ? (
          <>
            <BreadcrumbItem>
              {!isMobile ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbObj.hiddenBreadcrumbList.map(
                      (item: any, index: number) => (
                        <DropdownMenuItem key={index}>
                          {!item.href ? (
                            <span>{item.title}</span>
                          ) : (
                            <Link href={item.href ? item.href : "#"}>
                              {item.title}
                            </Link>
                          )}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>
                        Select a page to navigate to.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-2 lg:px-4">
                      {breadcrumbObj.hiddenBreadcrumbList.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            {item.clickable == false ? (
                              <span className="py-1 text-sm">{item.title}</span>
                            ) : (
                              <Link
                                href={item.href ? item.href : "#"}
                                className="py-1 text-sm"
                              >
                                {item.title}
                              </Link>
                            )}
                          </div>
                        )
                      )}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            {!isMobile && <BreadcrumbSeparator />}
          </>
        ) : null}
        {!isMobile &&
          breadcrumbObj.lastVisibleBreadcrumbList.map(
            (item: any, index: number) =>
              index == breadcrumbObj.lastVisibleBreadcrumbList.length - 1 ? (
                <BreadcrumbItem key={"last" + index}>
                  <BreadcrumbPage className="max-w-20 truncate md:max-w-none cursor-pointer">
                    {item.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <Fragment key={"last" + index}>
                  <BreadcrumbItem>
                    {!item.href ? (
                      <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                        {item.title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className="max-w-20 truncate md:max-w-none cursor-pointer"
                        onClick={() => {
                          backBreadcrumb(item);
                          redirect(item.href);
                        }}
                      >
                        {item.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator key={"lastsep" + index} />
                </Fragment>
              )
          )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function RenderAppBreadcrumb({
  breadcrumb,
}: {
  breadcrumb: BreadcrumbItemProps;
}) {
  const { addBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    addBreadcrumb(breadcrumb);
  }, [breadcrumb]);
  return <></>;
}
