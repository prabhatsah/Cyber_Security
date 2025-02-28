"use client";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { ChevronRight } from "lucide-react";

const GenericBreadcrumb = () => {
  const { items } = useBreadcrumb();

  return (
    <nav aria-label="breadcrumb">
      <ul className="flex items-center space-x-1 text-gray-600 text-sm ml-[-15px]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-1 ">
            {item.href ? (
              <a href={item.href} className="">
                {item.label}
              </a>
            ) : (
              <span className="">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default GenericBreadcrumb;
