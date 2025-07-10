import { X } from "lucide-react";

interface FilePreviewCardProps {
  file: File;
  onRemove: () => void;
}

const FilePreviewCard: React.FC<FilePreviewCardProps> = ({ file, onRemove }) => {
  return (
    <div className="relative w-48 border rounded-md p-3 bg-white shadow-sm dark:bg-[#1e1e1e] dark:border-gray-700">
      <button
        type="button"
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={onRemove}
      >
        <X size={16} />
      </button>
      <div className="flex flex-col items-start gap-2">
        <div className="truncate w-full text-sm font-medium text-gray-800 dark:text-white">
          📄 {file.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {(file.size / 1024).toFixed(2)} KB
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <div className="bg-green-500 h-1.5 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default FilePreviewCard;
