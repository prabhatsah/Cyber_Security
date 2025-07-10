import { Badge } from '@/shadcn/ui/badge';
import React from 'react';

// --- Component 2: ControlPolicyNameCard ---
interface ControlPolicyNameCardProps {
    indexNumber: number | string;
    title: string;
    rightNumber: number | string;
    weight: number | string;
    onClick: () => void;
    isSelected: boolean;
}

const ControlPolicyNameCard: React.FC<ControlPolicyNameCardProps> = ({
    indexNumber,
    title,
    rightNumber,
    weight,
    onClick,
    isSelected,
}) => {

    const wordLimit = 3;
    const limitedTitle = title.split(" ").slice(0, wordLimit).join(" ") + (title.split(" ").length > wordLimit ? "..." : "");

    return (
        
        <div
            className={`w-full rounded-sm shadow-md overflow-hidden p-3 mb-3 cursor-pointer
    ${isSelected ? 'bg-white text-gray-900' : 'text-gray-100'}`}
            style={!isSelected ? { backgroundColor: '#232323' } : undefined}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm bg-gray-700 text-gray-300`}>
                        {indexNumber}
                    </div>
                    <h3 className={`text-base text-ellipsis ${isSelected ? 'text-gray-900' : 'text-gray-100'}`} title={title}>
                        {limitedTitle}
                    </h3>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300`}>
                    {rightNumber}
                </span>
                {/* <Badge className="text-white bg-[#363636]">
                    {rightNumber}
                </Badge> */}
            </div>
            <div className="flex justify-start pt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full
          ${isSelected ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-300'}
        `}>
                    Weight - {weight}
                </span>
            </div>
        </div>
    );
};

export default ControlPolicyNameCard;