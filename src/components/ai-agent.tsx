"use client";
import { useEffect, useState, useRef, use } from "react";
import { Bot, Send, User, Cpu, Sparkles, Trash, Download, Copy, Loader2, ExternalLink, Database, Shield, Search } from "lucide-react"
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTicket } from "@/ikon/utils/actions/auth";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { mapSoftwareName } from "@/ikon/utils/api/softwareService";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { Menu } from 'lucide-react';

// Table options that match backend
const TABLE_OPTIONS = {
    "1": {
        display_name: "Penetration Testing",
        table_name: "PentestTable",
        // description: "Data from penetration testing activities, security assessments, and vulnerability exploitation tests"
    },
    "2": {
        display_name: "Vulnerability Scan",
        table_name: "VulscanTable",
        // description: "Data from vulnerability scanning results, automated security assessments, and system weaknesses"
    },
    "3": {
        display_name: "Generic",
        table_name: "Generic"
    }
};

// AI feature data updated for cybersecurity focus
const ai_features = [
    {
        id: "database-queries",
        title: "Database Queries",
        description: "Query penetration testing and vulnerability scan data from your security database",
        icon: Database,
        examplePrompts: [
            "Show me all penetration testing records",
            "How many vulnerability scans were performed this month?",
            "Find the latest security assessment results",
            "What are the most critical vulnerabilities found?"
        ]
    },
    {
        id: "threat-analysis",
        title: "Threat Analysis",
        description: "Analyze security threats, vulnerabilities, and assessment results",
        icon: Shield,
        examplePrompts: [
            "Analyze the security posture based on recent scans",
            "What are the trending vulnerability types?",
            "Compare penetration test results over time",
            "Identify high-risk security gaps"
        ]
    },
    {
        id: "security-insights",
        title: "Security Insights",
        description: "Get insights and recommendations for cybersecurity improvements",
        icon: Sparkles,
        examplePrompts: [
            "What security improvements should we prioritize?",
            "How can we reduce our attack surface?",
            "What are the best practices for vulnerability management?",
            "Recommend security controls for identified threats"
        ]
    },
    {
        id: "technical-support",
        title: "Technical Support",
        description: "Get help with cybersecurity tools, programming, and technical questions",
        icon: Cpu,
        examplePrompts: [
            "How do I configure a vulnerability scanner?",
            "Write a Python script for log analysis",
            "Explain how SQL injection attacks work",
            "Help me understand penetration testing methodology"
        ]
    }
];

// Types for chat messages
type MessageType = "user" | "assistant";

interface Message {
    id: string;
    type: MessageType;
    content: string;
    timestamp: Date;
}

interface TableOption {
    display_name: string;
    table_name: string;
    description: string;
}

export default function Ai_agent({ params }: { params: Promise<{ id: string; floorId: string; equipmentId: string }> }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            type: "assistant",
            content: "Hello! I'm your **CyberSecurity Expert**. I can help you with:\n\n🔍 **Database Queries** - Access penetration testing and vulnerability scan data\n🛡️ **Threat Analysis** - Analyze security assessments and vulnerabilities\n💡 **Security Insights** - Get recommendations for security improvements\n🔧 **Technical Support** - Help with cybersecurity tools and programming\n\nHow can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const [analysisPrompt, setAnalysisPrompt] = useState("");
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [showExamplePrompts, setShowExamplePrompts] = useState(false);
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [tableOptions, setTableOptions] = useState<Record<string, TableOption>>(TABLE_OPTIONS);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    let temp_url = 'https://ikoncloud-uat.keross.com/cstools/ai-assistant';

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load table options from backend
    useEffect(() => {
        const fetchTableOptions = async () => {
            try {
                const response = await fetch('https://ikoncloud-uat.keross.com/cstools/get-table-options');
                if (response.ok) {
                    const data = await response.json();
                    setTableOptions(data.table_options);
                }
            } catch (error) {
                console.error('Error fetching table options:', error);
            }
        };
        fetchTableOptions();
    }, []);

    // Handle sending a message
    const handleSendMessage = async (message = inputValue) => {
        if (!message.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: message,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);
        setShowExamplePrompts(false);

        const url = temp_url;
        let ticket = await getTicket();
        const accountId = await getActiveAccountId();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "chatInput": message,
                    "ticket": ticket,
                    "accountId": accountId,
                    "sessionId": ticket
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');

            if (!reader) {
                throw new Error("Failed to get reader from response body.");
            }

            const assistantMessageId = (Date.now() + 1).toString();
            let accumulatedContent = "";
            let newAssistantMessage: Message = {
                id: assistantMessageId,
                type: "assistant",
                content: "",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, newAssistantMessage]);

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.substring(6);
                        if (data === '[DONE]') {
                            setIsLoading(false);
                            reader.cancel();
                            return;
                        }
                        accumulatedContent += data;
                        setMessages(prevMessages =>
                            prevMessages.map(msg =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: accumulatedContent }
                                    : msg
                            )
                        );
                    }
                }
            }
            setIsLoading(false);

        } catch (error) {
            console.error('Error during fetch or streaming:', error);
            setIsLoading(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + "-error",
                    type: "assistant",
                    content: `❌ **Error**: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
                    timestamp: new Date(),
                },
            ]);
        }
    };

    // Handle key press (Enter to send)
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle clearing chat history
    const handleClearChat = async () => {
        setMessages([
            {
                id: "welcome",
                type: "assistant",
                content: "Hello! I'm your **CyberSecurity Expert**. I can help you with:\n\n🔍 **Database Queries** - Access penetration testing and vulnerability scan data\n🛡️ **Threat Analysis** - Analyze security assessments and vulnerabilities\n💡 **Security Insights** - Get recommendations for security improvements\n🔧 **Technical Support** - Help with cybersecurity tools and programming\n\nHow can I help you today?",
                timestamp: new Date()
            }
        ]);

        // Clear table selection in backend
        try {
            let ticket = await getTicket();
            await fetch('https://ikoncloud-uat.keross.com/cstools/clear-table-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ticket": ticket
                })
            });
        } catch (error) {
            console.error('Error clearing table selection:', error);
        }
    };

    // Handle table selection
    const handleTableSelection = async (tableKey: string) => {
        setSelectedTable(tableKey);

        try {
            let ticket = await getTicket();
            const response = await fetch('https://ikoncloud-uat.keross.com/cstools/table-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "table_key": tableKey,
                    "ticket": ticket
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Add a system message about table selection
                const systemMessage: Message = {
                    id: Date.now().toString(),
                    type: "assistant",
                    content: `✅ **Domain Selected: ${data.selected_table}**\n\n${data.description}\n\n**You can now ask questions about this data!**`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, systemMessage]);
            }
        } catch (error) {
            console.error('Error setting table selection:', error);
        }
    };

    // Handle data analysis request
    const handleAnalyzeData = () => {
        if (!analysisPrompt.trim()) return;

        const analysisMessage = `**Security Analysis Request:**\n\n${analysisPrompt}`;
        setAnalysisPrompt("");
        setActiveTab("chat");
        handleSendMessage(analysisMessage);
    };

    // Handle analysis form submission
    const handleAnalysisSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAnalyzeData();
    };

    // Handle feature selection
    const handleFeatureSelect = (featureId: string) => {
        setSelectedFeature(featureId === selectedFeature ? null : featureId);
        setShowExamplePrompts(featureId !== selectedFeature);
    };

    // Handle example prompt selection
    const handleExamplePromptSelect = (prompt: string) => {
        setInputValue(prompt);
        setShowExamplePrompts(false);
        setActiveTab("chat");
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/10 p-3 rounded-full">
                            <Shield className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">CyberSecurity AI Assistant</h1>
                            <p className="text-muted-foreground">Penetration Testing & Vulnerability Analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleClearChat}>
                            <Trash className="h-4 w-4" />
                            <span>Clear Chat</span>
                        </Button>
                        <Button className="gap-2">
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <Card className="lg:col-span-2">
                        <CardContent className="p-0">
                            <div className="w-full">

                                <div className="m-0">
                                    <div className="flex flex-col h-[80vh]">
                                        <div className="p-4 border-b bg-muted/30">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Menu className="h-4 w-4" />
                                                    <span className="text-sm font-medium">Services:</span>
                                                </div>
                                                <Select value={selectedTable} onValueChange={handleTableSelection}>
                                                    <SelectTrigger className="w-[300px]">
                                                        <SelectValue placeholder="Choose a security data source" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(tableOptions).map(([key, option]) => (
                                                            <SelectItem key={key} value={key}>
                                                                <div className="flex items-center gap-2">
                                                                    {key === "1" ?
                                                                        <Shield className="h-4 w-4 text-red-500" /> :
                                                                        <Search className="h-4 w-4 text-blue-500" />
                                                                    }
                                                                    {option.display_name}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {selectedTable && (
                                                <div className="mt-3 p-3 bg-background rounded-lg border">
                                                    <p className="text-sm text-muted-foreground">
                                                        {tableOptions[selectedTable]?.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <ScrollArea className="flex-1 px-6 py-4">
                                            <div className="space-y-4">
                                                {messages.map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                                                    >
                                                        <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                                                            <Avatar className={`h-8 w-8 ${message.type === "assistant" ? "bg-red-500" : "bg-muted"}`}>
                                                                <AvatarFallback>
                                                                    {message.type === "assistant" ? <Shield className="h-4 w-4 text-white" /> : <User className="h-4 w-4" />}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className={`rounded-lg px-4 py-3 ${message.type === "assistant"
                                                                ? "bg-muted text-foreground"
                                                                : "bg-primary text-primary-foreground"
                                                                }`}>
                                                                <div className="whitespace-pre-wrap">
                                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                                </div>
                                                                <div className={`text-xs mt-1 ${message.type === "assistant"
                                                                    ? "text-muted-foreground"
                                                                    : "text-primary-foreground/80"
                                                                    }`}>
                                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {isLoading && (
                                                    <div className="flex justify-start">
                                                        <div className="flex gap-3 max-w-[80%]">
                                                            <Avatar className="h-8 w-8 bg-red-500">
                                                                <AvatarFallback>
                                                                    <Shield className="h-4 w-4 text-white" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="rounded-lg px-4 py-3 bg-muted text-foreground">
                                                                <div className="flex items-center gap-2">
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                    <span>Analyzing...</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </ScrollArea>

                                        {/* Quick Query Buttons */}
                                        {selectedTable && (
                                            <div className="px-6 py-2 border-t bg-muted/20">
                                                <div className="flex gap-2 flex-wrap">
                                                    {[
                                                        "Show me all records",
                                                        "How many entries are there?",
                                                        "What are the latest results?",
                                                        "Find critical vulnerabilities"
                                                    ].map((query, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSendMessage(query)}
                                                            disabled={isLoading}
                                                        >
                                                            {query}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-4 border-t">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Ask about security data, vulnerabilities, or get technical help..."
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyDown={handleKeyPress}
                                                    disabled={isLoading}
                                                />
                                                <Button
                                                    onClick={() => handleSendMessage()}
                                                    disabled={!inputValue.trim() || isLoading}
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardHeader>
                            <CardTitle>AI Assistant Capabilities</CardTitle>
                            <CardDescription>
                                Cybersecurity-focused AI features and tools
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ai_features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className={`space-y-2 rounded-lg p-3 transition-colors cursor-pointer hover:bg-muted/50 ${selectedFeature === feature.id ? 'bg-muted/50 ring-1 ring-primary/20' : ''
                                        }`}
                                    onClick={() => handleFeatureSelect(feature.id)}
                                    tabIndex={0}
                                    role="button"
                                    aria-pressed={selectedFeature === feature.id}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleFeatureSelect(feature.id);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="bg-red-500/10 p-2 rounded-full">
                                            <feature.icon className="h-5 w-5 text-red-500" />
                                        </div>
                                        <h3 className="font-medium">{feature.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-9">
                                        {feature.description}
                                    </p>

                                    {showExamplePrompts && selectedFeature === feature.id && (
                                        <div className="mt-2 pl-9 space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground">Example prompts:</p>
                                            <div className="space-y-1">
                                                {feature.examplePrompts.map((prompt, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-sm bg-background rounded border px-3 py-2 cursor-pointer hover:border-primary transition-colors flex justify-between items-center"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExamplePromptSelect(prompt);
                                                        }}
                                                        tabIndex={0}
                                                        role="button"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleExamplePromptSelect(prompt);
                                                            }
                                                        }}
                                                    >
                                                        <span>{prompt}</span>
                                                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open('/security-docs', '_blank')}
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                Security Documentation
                            </Button>
                        </CardFooter>
                    </Card> */}
                </div>
            </div>
        </>
    );
}