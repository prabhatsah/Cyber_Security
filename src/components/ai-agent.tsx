"use client";
import { useEffect, useState, useRef } from "react";
import {
    Bot, Send, User, Cpu, Sparkles, Trash, Download, Copy, Loader2,
    ExternalLink, Database, Shield, Search, Menu, MessageSquare,
    Zap, Brain, Settings, HelpCircle, ChevronDown, Star, Clock,
    FileText, BarChart3, AlertTriangle, CheckCircle2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTicket } from "@/ikon/utils/actions/auth";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks';

// Base API URL - update this to match your backend
const API_BASE_URL = 'https://ikoncloud-uat.keross.com/cstools';

// Table options interface matching backend
interface TableOption {
    key: string;
    display_name: string;
    description: string;
}

// Default table options (will be updated from backend)
const DEFAULT_TABLE_OPTIONS: TableOption[] = [
    {
        key: "1",
        display_name: "Penetration Testing",
        description: "Data from penetration testing activities, security assessments, and vulnerability exploitation tests"
    },
    {
        key: "2",
        display_name: "Vulnerability Scan",
        description: "Data from vulnerability scanning results, automated security assessments, and system weaknesses"
    }
];

// AI feature data updated for cybersecurity focus
const ai_features = [
    {
        id: "database-queries",
        title: "Database Queries",
        description: "Query penetration testing and vulnerability scan data from your security database",
        icon: Database,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-200",
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
        icon: AlertTriangle,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-200",
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
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-200",
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
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-200",
        examplePrompts: [
            "How do I configure a vulnerability scanner?",
            "Write a Python script for log analysis",
            "Explain how SQL injection attacks work",
            "Help me understand penetration testing methodology"
        ]
    }
];

// Quick action buttons
const quickActions = [
    { label: "Show all records", icon: FileText },
    { label: "Latest results", icon: Clock },
    { label: "Critical vulnerabilities", icon: AlertTriangle },
    { label: "Security summary", icon: BarChart3 }
];

// Types for chat messages
type MessageType = "user" | "assistant" | "system";

interface Message {
    id: string;
    type: MessageType;
    content: string;
    timestamp: Date;
}

interface SessionInfo {
    session_id: string;
    has_table_selection: boolean;
    selected_table: {
        key: string;
        display_name: string;
        table_name: string;
        description: string;
    } | null;
    message_count: number;
}

// Custom components for ReactMarkdown
const MarkdownComponents = {
    h1: ({ children }: any) => (
        <h1 className="text-2xl font-bold  mb-4 border-b border-gray-200 pb-2">
            {children}
        </h1>
    ),
    h2: ({ children }: any) => (
        <h2 className="text-sm font-semibold  mb-3 mt-6">
            {children}
        </h2>
    ),
    h3: ({ children }: any) => (
        <h3 className="text-lg font-medium  mb-2 mt-4">
            {children}
        </h3>
    ),
    p: ({ children }: any) => (
        <p className=" mb-3 leading-relaxed">
            {children}
        </p>
    ),
    ul: ({ children }: any) => (
        <ul className="list-disc list-inside  mb-3 space-y-1 ml-4">
            {children}
        </ul>
    ),
    ol: ({ children }: any) => (
        <ol className="list-decimal list-inside  mb-3 space-y-1 ml-4">
            {children}
        </ol>
    ),
    li: ({ children }: any) => (
        <li className=" mb-1">
            {children}
        </li>
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 mb-3 italic text-blue-900">
            {children}
        </blockquote>
    ),
    code: ({ inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline ? (
            <div className="relative mb-4">
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                        <code className={className} {...props}>
                            {children}
                        </code>
                    </pre>
                </div>
                {match && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gray-700  text-xs rounded">
                        {match[1]}
                    </div>
                )}
            </div>
        ) : (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
            </code>
        );
    },
    table: ({ children }: any) => (
        <div className="overflow-x-auto mb-4">
            <table className="min-w-full  border border-gray-300 rounded-lg overflow-hidden">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }: any) => (
        <thead className="bg-gray-50">
            {children}
        </thead>
    ),
    tbody: ({ children }: any) => (
        <tbody className="divide-y divide-gray-200">
            {children}
        </tbody>
    ),
    tr: ({ children }: any) => (
        <tr className="hover:bg-gray-50">
            {children}
        </tr>
    ),
    th: ({ children }: any) => (
        <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider border-b border-gray-300">
            {children}
        </th>
    ),
    td: ({ children }: any) => (
        <td className="px-4 py-3 text-sm border-b border-gray-200">
            {children}
        </td>
    ),
    strong: ({ children }: any) => (
        <strong className="font-semibold ">
            {children}
        </strong>
    ),
    em: ({ children }: any) => (
        <em className="italic ">
            {children}
        </em>
    ),
    a: ({ href, children }: any) => (
        <a
            href={href}
            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    ),
    hr: () => (
        <hr className="my-6 border-gray-300" />
    )
};

export default function Ai_agent({ params }: { params: Promise<{ id: string; floorId: string; equipmentId: string }> }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            type: "assistant",
            content: "👋 **Welcome to CyberSecurity AI Assistant!**\n\nI'm your intelligent security companion, ready to help you with:\n\n🔍 **Database Queries** - Access and analyze your security data\n🛡️ **Threat Analysis** - Deep dive into vulnerabilities and risks\n💡 **Security Insights** - Get actionable recommendations\n🔧 **Technical Support** - Expert help with tools and methodologies\n\n**Get started by selecting a data source above, then ask me anything!**",
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
    const [tableOptions, setTableOptions] = useState<TableOption[]>(DEFAULT_TABLE_OPTIONS);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load initial data from backend
    useEffect(() => {
        const initializeApp = async () => {
            try {
                await Promise.all([
                    fetchTableOptions(),
                    fetchSessionInfo(),
                    checkHealth()
                ]);
                setConnectionStatus('connected');
            } catch (error) {
                console.error('Error initializing app:', error);
                setConnectionStatus('error');
            }
        };
        initializeApp();
    }, []);

    // Fetch table options from backend
    const fetchTableOptions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get-table-options`);
            if (response.ok) {
                const data = await response.json();
                setTableOptions(data.table_options || DEFAULT_TABLE_OPTIONS);
            }
        } catch (error) {
            console.error('Error fetching table options:', error);
        }
    };

    // Fetch session info from backend
    const fetchSessionInfo = async () => {
        try {
            const ticket = await getTicket();
            const response = await fetch(`${API_BASE_URL}/session-info?session_id=${ticket}`);
            if (response.ok) {
                const data = await response.json();
                setSessionInfo(data);
                if (data.has_table_selection && data.selected_table) {
                    setSelectedTable(data.selected_table.key);
                }
            }
        } catch (error) {
            console.error('Error fetching session info:', error);
        }
    };

    // Check backend health
    const checkHealth = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            if (!response.ok) {
                throw new Error('Health check failed');
            }
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    };

    // Clean up content for better formatting
    const cleanupContent = (rawContent: string): string => {
        let cleaned = rawContent;

        // Remove excessive whitespace but preserve intentional spacing
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

        // Fix markdown formatting issues
        cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '**$1**');
        cleaned = cleaned.replace(/\*([^*]+)\*/g, '*$1*');

        // Fix list formatting
        cleaned = cleaned.replace(/^(\s*)[-*+]\s+/gm, '$1- ');
        cleaned = cleaned.replace(/^(\s*)\d+\.\s+/gm, '$1$&');

        // Fix table formatting
        cleaned = cleaned.replace(/\|\s*\|\s*$/gm, '|');
        cleaned = cleaned.replace(/\|\s+/g, '| ');
        cleaned = cleaned.replace(/\s+\|/g, ' |');

        // Ensure proper spacing around headers
        cleaned = cleaned.replace(/^(#{1,6})\s*/gm, '$1 ');

        // Fix code block formatting
        cleaned = cleaned.replace(/```(\w*)\n/g, '```$1\n');

        return cleaned.trim();
    };

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

        try {
            const ticket = await getTicket();
            const accountId = await getActiveAccountId();

            const response = await fetch(`${API_BASE_URL}/ai-assistant`, {
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
                        const cleanedContent = cleanupContent(accumulatedContent);
                        setMessages(prevMessages =>
                            prevMessages.map(msg =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: cleanedContent }
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
        try {
            const ticket = await getTicket();
            await fetch(`${API_BASE_URL}/clear-chat-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ticket": ticket
                })
            });

            // Reset local state
            setMessages([
                {
                    id: "welcome",
                    type: "assistant",
                    content: "Hello! I'm your **CyberSecurity Expert**. I can help you with:\n\n🔍 **Database Queries** - Access penetration testing and vulnerability scan data\n🛡️ **Threat Analysis** - Analyze security assessments and vulnerabilities\n💡 **Security Insights** - Get recommendations for security improvements\n🔧 **Technical Support** - Help with cybersecurity tools and programming\n\n**To get started:**\n1. Select a data source from the dropdown above for database queries\n2. Or ask me any general cybersecurity questions\n\nHow can I help you today?",
                    timestamp: new Date()
                }
            ]);
            setSelectedTable("");
            setSessionInfo(null);
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    };

    // Handle table selection
    const handleTableSelection = async (tableKey: string) => {
        // Don't do anything if the selected table is already the same
        if (tableKey === selectedTable) return;

        // Set the selected table to the new table key
        setSelectedTable(tableKey);

        try {
            const ticket = await getTicket();

            // Call the backend to set the table selection
            const response = await fetch(`${API_BASE_URL}/table-selection`, {
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

                // Send a system message to inform the user about the selected table
                const systemMessage: Message = {
                    id: Date.now().toString(),
                    type: "system",
                    content: `✅ **Data Source Selected: ${data.selected_table}**\n\n${data.description}\n\n**You can now ask questions about this data!**`,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, systemMessage]);

                // Optionally, fetch updated session information
                await fetchSessionInfo();
            } else {
                // Handle the error case if the response is not successful
                const errorMessage: Message = {
                    id: Date.now().toString(),
                    type: "system",
                    content: `❌ **Error**: Unable to select the data source. Please try again.`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Error setting table selection:', error);

            // Show error message if something goes wrong
            const errorMessage: Message = {
                id: Date.now().toString(),
                type: "system",
                content: `❌ **Error selecting data source**: ${error instanceof Error ? error.message : String(error)}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };


    // Handle clearing table selection
    const handleClearTableSelection = async () => {
        try {
            const ticket = await getTicket();
            await fetch(`${API_BASE_URL}/clear-table-selection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ticket": ticket
                })
            });
            setSelectedTable("");
            await fetchSessionInfo();
        } catch (error) {
            console.error('Error clearing table selection:', error);
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

    // Get quick query suggestions based on selected table
    const getQuickQueries = () => {
        const selectedTableOption = tableOptions.find(opt => opt.key === selectedTable);
        if (!selectedTableOption) return [];

        if (selectedTable === "1") { // Penetration Testing
            return [
                "Show me all penetration testing records",
                "List all tested sites and hosts",
                "What are the latest pentest results?",
                "Find recent penetration testing activities"
            ];
        } else if (selectedTable === "2") { // Vulnerability Scan
            return [
                "Show me all vulnerability scan results",
                "How many vulnerabilities were found?",
                "What are the critical vulnerabilities?",
                "List the latest vulnerability assessments"
            ];
        }
        return [
            "Show me all records",
            "How many entries are there?",
            "What are the latest results?",
            "Find recent activities"
        ];
    };

    return (
        <div className="">
            <div className="">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold ">
                                    CyberSecurity AI Assistant
                                </h1>
                                <p className=" mt-1 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    Intelligent Security Analysis & Support
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="gap-2 bg-red-500 text-white  transition-all duration-200"
                                onClick={handleClearChat}
                            >
                                <Trash className="h-4 w-4" />
                                Clear Session
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - AI Features */}
                    <div className={`lg:col-span-1 `}>
                        <div className="sticky top-4 space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
                            {/* Data Source Selection */}
                            <Card className="border">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Database className="h-5 w-5 text-blue-500" />
                                        Data Source
                                    </CardTitle>
                                    <CardDescription>
                                        Select your security data source
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Select value={selectedTable || ""} onValueChange={handleTableSelection}>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Choose a security data source">
                                                {selectedTable ?
                                                    tableOptions.find(opt => opt.key === selectedTable)?.display_name
                                                    : "Choose a security data source"
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tableOptions.map((option) => (
                                                <SelectItem key={option.key} value={option.key}>
                                                    <div className="flex items-center gap-2">
                                                        {option.key === "1" ? (
                                                            <Shield className="h-4 w-4 text-red-500" />
                                                        ) : (
                                                            <Search className="h-4 w-4 text-blue-500" />
                                                        )}
                                                        {option.display_name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {selectedTable && (
                                        <div className="mt-4 p-3  border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span className="text-sm font-medium ">Connected</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* AI Features */}
                            <Card className="border  flex-1">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Brain className="h-5 w-5 text-purple-500" />
                                        AI Capabilities
                                    </CardTitle>
                                    <CardDescription>
                                        Explore what I can help you with
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                                    {ai_features.map((feature) => (
                                        <div
                                            key={feature.id}
                                            className={`group cursor-pointer rounded-xl p-4 transition-all duration-200 border-2 ${selectedFeature === feature.id
                                                ? `${feature.borderColor} ${feature.bgColor} shadow-md`
                                                : 'border'
                                                }`}
                                            onClick={() => handleFeatureSelect(feature.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                                                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold  mb-1">{feature.title}</h3>
                                                    <p className="text-sm  leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                                <ChevronDown className={`h-4 w-4  transition-transform duration-200 ${selectedFeature === feature.id ? 'rotate-180' : ''
                                                    }`} />
                                            </div>

                                            {showExamplePrompts && selectedFeature === feature.id && (
                                                <div className="mt-4 pt-4 border-t  space-y-2">
                                                    <p className="text-xs font-medium  mb-3">Try these examples:</p>
                                                    {feature.examplePrompts.map((prompt, index) => (
                                                        <button
                                                            key={index}
                                                            className="w-full text-left p-3 text-sm  rounded-lg border  transition-all duration-200 group"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleExamplePromptSelect(prompt);
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="">{prompt}</span>
                                                                <ArrowRight className="h-3 w-3  group-hover:text-blue-500 transition-colors" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="lg:col-span-3">
                        <Card className="border h-[calc(100vh-13rem)] flex flex-col">
                            {/* Chat Header */}
                            <div className="p-6 border-b  flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 bg-gradient-to-br from-red-500 to-red-600">
                                                <AvatarFallback>
                                                    <Bot className="h-5 w-5 " />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 "></div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold ">Cyber Security Expert</h3>
                                            <p className="text-sm ">Ready to help</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-6 min-h-0">
                                <div className="space-y-6">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`flex gap-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                                                <Avatar className={`h-8 w-8 flex-shrink-0 ${message.type === "assistant"
                                                    ? "bg-gradient-to-br from-red-500 to-red-600"
                                                    : "bg-gradient-to-br from-blue-500 to-blue-600"
                                                    }`}>
                                                    <AvatarFallback>
                                                        {message.type === "assistant"
                                                            ? <Bot className="h-4 w-4 " />
                                                            : <User className="h-4 w-4 " />
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`rounded-2xl px-4 py-3 shadow-sm ${message.type === "assistant"
                                                    ? " border "
                                                    : " from-blue-500 to-blue-600 "
                                                    }`}>
                                                    <div className={`${message.type === "assistant" ? "" : ""}`}>
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                                            rehypePlugins={[rehypeRaw]}
                                                            components={message.type === "assistant" ? MarkdownComponents : undefined}
                                                            className={message.type === "assistant" ? "markdown-content" : ""}
                                                        >
                                                            {message.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                    <div className={`text-xs mt-2 ${message.type === "assistant"
                                                        ? ""
                                                        : "text-blue-100"
                                                        }`}>
                                                        {message.timestamp.toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-3 max-w-[85%]">
                                                <Avatar className="h-8 w-8 bg-gradient-to-br from-red-500 to-red-600">
                                                    <AvatarFallback>
                                                        <Bot className="h-4 w-4 " />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                                        <span className="text-gray-600">Analyzing your request...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Quick Actions */}
                            {selectedTable && (
                                <div className="px-6 py-3 border-t  flex-shrink-0">
                                    <div className="flex gap-2 flex-wrap">
                                        {quickActions.map((action, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2  transition-all duration-200"
                                                onClick={() => handleSendMessage(action.label)}
                                                disabled={isLoading}
                                            >
                                                <action.icon className="h-3 w-3" />
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-6 border-t  flex-shrink-0">
                                <div className="flex gap-3">
                                    <div className="flex-1 relative">
                                        <Input
                                            placeholder="Ask about security data, vulnerabilities, or get technical help..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            disabled={isLoading}
                                            className="pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <MessageSquare className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs ">
                                    <span>Press Enter to send, Shift+Enter for new line</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>AI Ready</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}