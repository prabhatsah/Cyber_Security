import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shadcn/ui/card";
import { format } from "date-fns";
import { Calendar } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import { Button } from '@/shadcn/ui/button';
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";

interface DateRemark {
    date: Date;
    remark: string;
    providedBy: string;
}

interface FollowUpRemarksProps {
    remarks: DateRemark[];
}

const FollowUpRemarks: React.FC<FollowUpRemarksProps> = ({ remarks }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    // Sort the remarks by date
    const sortedRemarks = [...remarks].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Group remarks by date
    const groupedRemarks: { [date: string]: DateRemark[] } = {};
    sortedRemarks.forEach(remark => {
        const formattedDate = format(remark.date, SAVE_DATE_FORMAT_GRC);
        if (groupedRemarks[formattedDate]) {
            groupedRemarks[formattedDate].push(remark);
        } else {
            groupedRemarks[formattedDate] = [remark];
        }
    });
    const toggleDialog = () => setDialogOpen(prev => !prev);

    return (
        <div className="space-y-4 p-2">
            {Object.entries(groupedRemarks).map(([date, remarks]) => (
                <Card key={date} className="h-[120px]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar size={18} /> {date}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {remarks.map((remark, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-700 pb-4 last:border-0"
                            >
                                <div className="flex items-start justify-between gap-8">
                                    {/* Remark */}
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Remark
                                        </label>
                                        <div className="text-gray-100 whitespace-pre-wrap text-base">
                                            {remark.remark}
                                        </div>
                                    </div>

                                    {/* Provided By */}
                                    <div className="text-right text-xs text-gray-400 min-w-[120px]">
                                        <label className="block text-xs font-medium text-gray-400 mb-1">
                                            Participant
                                        </label>
                                        <div className="text-blue-300 font-semibold">{remark.providedBy}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );

};



export default FollowUpRemarks;