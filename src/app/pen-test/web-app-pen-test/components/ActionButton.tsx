import React from 'react';
import { FolderOpen as RiFolderOpenLine } from 'lucide-react';
import { RiPlayFill } from '@remixicon/react';

type ActionButtonProps = {
    href: string;
    title: string;
};

function ActionButton({ href, title }: ActionButtonProps) {
    return (
        <a
            href={href}
            title={title}
            className="inline-flex items-center justify-center p-2 rounded-md border border-transparent text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <RiPlayFill className="h-4 w-4" />
        </a>
    );
}

export default ActionButton;