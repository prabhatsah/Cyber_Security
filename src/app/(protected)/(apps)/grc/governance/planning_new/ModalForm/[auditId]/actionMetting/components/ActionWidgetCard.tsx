import React from 'react'
import { LucideIcon, Copy } from "lucide-react";
import { Card, CardHeader } from '@/shadcn/ui/card';


interface ActionWidgetCarddProps {
  title: string;
  content: string;
  icon?: LucideIcon;

}

export default function ActionWidgetCard({
  title,
  content,
  icon: Icon = Copy,
}: ActionWidgetCarddProps) {
  return (
    <>
      <Card>
        <CardHeader className='mb-5'>
          <div className="flex flex-row items-center gap-3">
            <div>
              <Icon className="text-white" />
            </div>
            <div className='flex flex-col gap-3'>
              <div className="text-white font-poppins text-lg font-medium leading-none">{title}</div>
              <div className="text-white/60 font-poppins text-xs font-normal leading-none">
                <div className="truncate max-w-[200px]" title={content}>
                  {content}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  )
}
