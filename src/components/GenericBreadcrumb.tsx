"use client";
// import { useBreadcrumb12 } from "@/contexts/BreadcrumbContext";
import { ChevronRight } from "lucide-react";
import { useBreadcrumb } from "./app-breadcrumb/BreadcrumbProvider";

const GenericBreadcrumb = () => {
  const { breadcrumbItems } = useBreadcrumb();

  return (
    <nav aria-label="breadcrumb">
      <ul
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-400   
       
       text-sm ml-[-15px] "
      >
        {breadcrumbItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center space-x-1 hover:dark:text-gray-50 hover:text-gray-900"
          >
            {item.href ? (
              <a href={item.href} className="">
                {item.title}
              </a>
            ) : (
              <span className="">{item.title}</span>
            )}
            {index < breadcrumbItems.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default GenericBreadcrumb;
