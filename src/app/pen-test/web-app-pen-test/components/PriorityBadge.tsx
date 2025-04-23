import React from 'react';

type PriorityBadgeProps = {
    level: string;
};

function PriorityBadge({ level }: PriorityBadgeProps) {
    const getPriorityStyles = (level: string) => {
        switch (level.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles(level)}`}>
            {level}
        </span>
    );
}

export default PriorityBadge;