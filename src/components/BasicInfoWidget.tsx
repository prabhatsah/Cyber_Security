import React from 'react';
import { Card } from "@tremor/react";

interface BasicInfoItem {
  name: string;
  value: string;
}

interface BasicInfoWidgetProps {
  items: BasicInfoItem[];
}

export const BasicInfoWidget: React.FC<BasicInfoWidgetProps> = ({ items }) => {
  return (
    <Card className="rounded-md">
      <div className="h-full">
        <ul
          role="list"
          className="grid grid-cols-1 h-full gap-6 lg:mt-0 lg:grid-cols-4"
        >
          {items.map((item) => (
            <li
              key={item.name}
              className="px-0 py-3 lg:px-4 lg:py-2 lg:text-left group"
            >
              <div className="border-l-2 border-l-white/70 pl-2 hover:border-l-blue-500 transition-colors">
                <p 
                  className="text-sm font-semibold text-widget-mainHeader truncate" 
                  title={item.value}
                >
                  {item.value}
                </p>
                <p 
                  className="text-sm text-widget-mainDesc truncate" 
                  title={item.name}
                >
                  {item.name}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};