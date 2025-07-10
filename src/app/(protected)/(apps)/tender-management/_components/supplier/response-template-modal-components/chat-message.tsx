import { Button } from "@/shadcn/ui/button";
import { Copy } from "lucide-react";

const ChatMessageResponse = ({
  message,
  isBot,
  onCopy,
  loading,
}: {
  message: string;
  isBot: boolean;
  onCopy: (text: string) => void;
  loading?: boolean;
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    onCopy(message);
  };

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`relative bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-lg text-sm shadow-md ${
          !isBot ? "bg-secondary text-black" : "bg-gray text-black"
        }`}
      >
        {loading ? (
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.6s]"></span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap pr-8">{message}</div>
        )}
        {isBot && !loading && (
          <Button
            type="button"
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatMessageResponse;
