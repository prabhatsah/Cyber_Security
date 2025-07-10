"use client";
import { useState, useRef, useEffect, Fragment } from "react";
import { toast } from "sonner";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/shadcn/ui/grcDrawer";
import { Bot, Send } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/shadcn/ui/textarea";
import PreviewTable from "./aigenerateTable";

export const DrawerHero = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function parseMarkdownTable(markdown: string) {
        // const tableRegex = /(\|.*\|[\r\n]+)(\|[-|: ]+\|[\r\n]+)((\|.*\|[\r\n]+)+)/;
        const tableRegex = /(\|.*\|[\r\n]*)+/g;
        const match = markdown.match(tableRegex);

        if (!match) return null;

        const tableText = match[0].trim();
        // const lines = tableText.split("\n");
        const lines = tableText.trimEnd().split(/\r?\n/);
        const cleanCell = (cell: string) => cell.replace(/\*\*/g, "").trim();

        // Extract headers
        const rawHeaders = lines[0]
            .split("|")
            .map(cleanCell)
            .filter((_, i, arr) => i !== 0 && i !== arr.length - 1 || arr.length === 2); // Remove first and last if empty

        const headers = rawHeaders.map((header) =>
            header.replace(/[^a-zA-Z0-9 ]/g, "").trim()
        );

        const rows = [];
        let lastPolicy = "";
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim().startsWith("|")) continue;

            const cols = line.split("|").map(cleanCell);
            const trimmedCols = cols.slice(1, -1); // remove first and last empty cols

            if (trimmedCols[0]) {
                lastPolicy = trimmedCols[0];
            }

            const row: Record<string, string> = {};
            headers.forEach((key, index) => {
                row[key] = trimmedCols[index] ?? "";
            });

            row[headers[0]] = lastPolicy;
            rows.push(row);
        }

        return {
            parsed: rows,
            headers,
            tableText,
        };
    }


    const initializeMessages = () => {
        if (!hasInitialized) {
            setMessages([
                {
                    id: Date.now(),
                    type: "bot",
                    content: "Hello! How can I assist you?",
                    loading: false,
                    timestamp: new Date(),
                },
            ]);
            setHasInitialized(true);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: "user",
            content: input,
            timestamp: new Date(),
        };

        const loadingId = Date.now() + 1;
        const loadingMessage = {
            id: loadingId,
            type: "bot",
            content: "",
            loading: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, loadingMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(
                "https://ikoncloud-dev.keross.com/aiagent/webhook/fc1d5b7c-aa49-448f-a1f1-64ed944d7b57",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatInput: input }),
                }
            );
            const data = await response.json();
            const markdown = data[0]?.output || "";
            // console.log("markdown -- ", markdown)

            const parsedResult = parseMarkdownTable(markdown);

            let previewDataToSet = [];
            let tableText = "";

            if (parsedResult) {
                previewDataToSet = parsedResult.parsed;
                tableText = parsedResult.tableText;
                setPreviewData(previewDataToSet);
            }

            const botMessage = {
                id: loadingId,
                type: "bot",
                content: markdown,
                hasTable: Boolean(parsedResult),
                tableOnlyContent: tableText, // added for preview usage
                loading: false,
                timestamp: new Date(),
            };

            setMessages((prev) =>
                prev.map((msg) => (msg.id === loadingId ? botMessage : msg))
            );
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            setMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="default" onClick={initializeMessages} className="flex items-center justify-center p-2">
                    {/* <Bot className="w-5 h-5" /> */}
                    Ask AI
                </Button>
            </DrawerTrigger>
            <DrawerContent className="sm:max-w-5xl">
                <DrawerHeader>
                    <div className="flex items-center justify-between w-full gap-2">
                        <Avatar>
                            {/* <AvatarImage src="/ikon-assistant.png" alt="IKON Assistant" /> */}
                            <AvatarFallback className="bg-muted flex items-center justify-center">
                                <Bot className="w-6 h-6 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DrawerTitle>GRC Assistant</DrawerTitle>
                            {/* <DrawerDescription className="text-xs text-muted-foreground">
                                    AI GRC Assistant
                                </DrawerDescription> */}
                        </div>
                    </div>
                    <PreviewTable open={showPreviewModal} setOpen={setShowPreviewModal} previewData={previewData || []} />
                </DrawerHeader>

                <DrawerBody>
                    <ScrollArea className="h-[72dvh]">
                        <div className="p-4 space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`} >
                                    <div className={`flex max-w-[90%] ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className="space-y-1 px-4 py-2">
                                            <div className={`rounded-lg px-4 py-2 ${message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`} >
                                                {message.loading ? (
                                                    <div className="flex space-x-1 items-center justify-start">
                                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="text-sm whitespace-pre-line">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                {message.content}
                                                            </ReactMarkdown>
                                                        </span>
                                                        <p className="text-xs opacity-70 mt-1">
                                                            {format(message.timestamp, "HH:mm")}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            {!message.loading && message.hasTable && (
                                                <Button
                                                    onClick={() => {
                                                        setPreviewData(parseMarkdownTable(message.tableOnlyContent)?.parsed || []);
                                                        setShowPreviewModal(true);
                                                    }}
                                                    className="mt-1"
                                                >
                                                    Preview
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                </DrawerBody>

                <DrawerFooter className="border-t">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="w-full" >
                        <div className="flex flex-row w-full gap-3">
                            <div className="h-100 flex-1">
                                <Textarea
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading || isListening}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            if (e.shiftKey) {
                                                return;
                                            } else {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="self-center"
                                disabled={isLoading || isListening}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >
    );
};