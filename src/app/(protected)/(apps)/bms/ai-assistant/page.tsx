"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, Cpu, Sparkles, Trash, Download, Copy, Loader2, ExternalLink } from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Input } from "@/shadcn/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Textarea } from "@/shadcn/ui/textarea"
import { Avatar, AvatarFallback } from "@/shadcn/ui/avatar"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

// Mock AI responses for demonstration
const mockResponses = [
  "I've analyzed the energy consumption data for the past month. There's a 12% increase in HVAC usage compared to the same period last year. This could be due to the unusually warm weather we've been experiencing.",
  "Based on the current sensor readings, I recommend scheduling maintenance for AHU-01 within the next 7 days. The filter efficiency has dropped below 75%, which could impact air quality and energy efficiency.",
  "I've detected an anomaly in the water consumption pattern in Zone B. There might be a small leak in the system. I recommend sending a technician to inspect the area.",
  "The occupancy patterns suggest that lighting in Zone C could be optimized. Current lighting remains at 80% brightness even when occupancy drops below 20%. Implementing adaptive lighting could save approximately 15% in energy costs.",
  "Security logs show multiple failed access attempts at the loading dock entrance between 2:00 AM and 3:00 AM. I've flagged this for security review and temporarily increased the sensitivity of motion detectors in that area."
];

// Mock analysis responses
const analysisResponses = [
  "I've analyzed the energy consumption data you provided. Here are my findings:\n\n" +
  "1. Energy consumption has increased by 8% compared to last month\n" +
  "2. HVAC systems are operating at 92% efficiency\n" +
  "3. There's an anomaly in the water usage pattern in Zone B\n\n" +
  "Recommendation: Schedule maintenance for the water system in Zone B within the next week to prevent potential issues.",
  
  "Based on the occupancy data analysis:\n\n" +
  "1. Peak occupancy occurs between 10:00 AM and 2:00 PM (65-80%)\n" +
  "2. Average daily occupancy is 47%, down 5% from previous month\n" +
  "3. Meeting rooms are underutilized (32% average occupancy)\n\n" +
  "Recommendation: Consider repurposing some meeting rooms or adjusting the booking system to improve utilization.",
  
  "Temperature trend analysis results:\n\n" +
  "1. Average temperature maintained at 22.3°C (within target range)\n" +
  "2. Temperature variance of ±1.2°C detected in Zone A\n" +
  "3. Identified potential air balancing issue in the east wing\n\n" +
  "Recommendation: Recalibrate thermostats in Zone A and inspect ductwork in the east wing for potential blockages."
];

// AI feature data with example prompts
const aiFeatures = [
  {
    id: "intelligent-analysis",
    title: "Intelligent Analysis",
    description: "Analyze building data to identify patterns, anomalies, and optimization opportunities",
    icon: Sparkles,
    examplePrompts: [
      "Analyze energy consumption trends for the past month",
      "Identify anomalies in the HVAC system performance",
      "Compare current water usage with historical patterns"
    ]
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance",
    description: "Predict equipment failures before they occur and recommend maintenance schedules",
    icon: Cpu,
    examplePrompts: [
      "When should I schedule maintenance for AHU-01?",
      "Predict potential failures in the cooling system",
      "Generate a maintenance schedule for all HVAC equipment"
    ]
  },
  {
    id: "natural-language",
    title: "Natural Language Interface",
    description: "Interact with your building systems using simple, conversational language",
    icon: Bot,
    examplePrompts: [
      "Turn down the temperature in Zone B by 2 degrees",
      "What's the current occupancy in the conference rooms?",
      "Show me the energy usage for the west wing"
    ]
  },
  {
    id: "automated-reporting",
    title: "Automated Reporting",
    description: "Generate detailed reports on building performance, energy usage, and maintenance needs",
    icon: Copy,
    examplePrompts: [
      "Generate a monthly energy consumption report",
      "Create a maintenance summary for Q1",
      "Prepare an occupancy analysis report for the executive team"
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

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your Building Management AI Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showExamplePrompts, setShowExamplePrompts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (message = inputValue) => {
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

    // Simulate AI response after a delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clearing chat history
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "assistant",
        content: "Hello! I'm your Building Management AI Assistant. How can I help you today?",
        timestamp: new Date()
      }
    ]);
  };

  // Handle data analysis request
  const handleAnalyzeData = () => {
    if (!analysisPrompt.trim()) return;
    
    // Add user message with analysis request
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Data Analysis Request: ${analysisPrompt}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setAnalysisPrompt("");
    setIsLoading(true);
    
    // Switch to chat tab to show the conversation
    setActiveTab("chat");

    // Simulate AI analysis response after a delay
    setTimeout(() => {
      // Select a random analysis response
      const randomAnalysis = analysisResponses[Math.floor(Math.random() * analysisResponses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomAnalysis,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2500);
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
    // Optional: Auto-send the prompt
    // handleSendMessage(prompt);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleClearChat}>
            <Trash className="h-4 w-4" />
            <span>Clear Chat</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Building Management Assistant</CardTitle>
            <CardDescription>
              Ask questions, request analysis, or get recommendations for your building systems
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mx-6 my-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="analyze">Data Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="m-0">
                <div className="flex flex-col h-[60vh]">
                  <ScrollArea className="flex-1 px-6 py-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                            <Avatar className={`h-8 w-8 ${message.type === "assistant" ? "bg-primary" : "bg-muted"}`}>
                              <AvatarFallback>
                                {message.type === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`rounded-lg px-4 py-3 ${
                              message.type === "assistant" 
                                ? "bg-muted text-foreground" 
                                : "bg-primary text-primary-foreground"
                            }`}>
                              <div className="whitespace-pre-wrap">{message.content}</div>
                              <div className={`text-xs mt-1 ${
                                message.type === "assistant" 
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
                            <Avatar className="h-8 w-8 bg-primary">
                              <AvatarFallback>
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-4 py-3 bg-muted text-foreground">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
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
              </TabsContent>
              
              <TabsContent value="analyze" className="m-0">
                <form onSubmit={handleAnalysisSubmit} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Data Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Describe the data you want to analyze and what insights you're looking for
                    </p>
                  </div>
                  
                  <Textarea
                    placeholder="Example: Analyze energy consumption trends for the past month and identify any anomalies"
                    className="min-h-[200px]"
                    value={analysisPrompt}
                    onChange={(e) => setAnalysisPrompt(e.target.value)}
                    required
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={!analysisPrompt.trim() || isLoading}
                      className="gap-2"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>Analyze Data</span>
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant Features</CardTitle>
            <CardDescription>
              Capabilities of your building management AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiFeatures.map((feature) => (
              <div 
                key={feature.id}
                className={`space-y-2 rounded-lg p-3 transition-colors cursor-pointer hover:bg-muted/50 ${
                  selectedFeature === feature.id ? 'bg-muted/50 ring-1 ring-primary/20' : ''
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
                  <div className="bg-primary/10 p-2 rounded-full">
                    <feature.icon className="h-5 w-5 text-primary" />
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
              onClick={() => window.open('/documentation', '_blank')}
            >
              View Documentation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}