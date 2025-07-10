"use client";
import React, { useEffect, useState } from "react";
import {
  Bot,
  Plus,
  X,
  Cpu,
  Sparkles,
  Briefcase,
  Shield,
  Database,
  Settings,
  FolderCog,
  ChevronDown,
  Trash2,
  Mic,
  MicOff,
  BarChart,
  Brain,
  Cloud,
  GitBranch,
  Activity,
  Book,
  Workflow,
} from "lucide-react";
import { TaskConfigurator } from "./components/TaskConfigurator";
import { AgentConfigurator } from "./components/AgentConfigurator";
import { PersonalAssistantConfigurator } from "./components/PersonalAssistantConfigurator";
import { AgentPerformance } from "./components/Analytics/AgentPerformance";
import { Dashboard } from "./components/Dashboard";
import { NotificationSystem } from "./components/NotificationSystem";
import { DomainList } from "./components/Domains/DomainList";
import { AppList } from "./components/Apps/AppList";
import { AgentList } from "./components/Agents/AgentList";
import { ChatWindow } from "./components/Chat/ChatWindow";
import { KnowledgeBase } from "./components/KnowledgeBase";
import { AgentStudio } from "./components/AgentStudio";
import type {
  Agent,
  Task,
  AgentConfiguration,
  PersonalAssistant,
  Message,
  Domain,
  SubDomain,
  App,
} from "./types/agent";
import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";
import {
  IconButton,
  IconTextButton,
  TextButton,
} from "@/ikon/components/buttons";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { MenuItem } from "@/ikon/components/app-sidebar/type";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

function App() {
  const [view, setView] = useState<
    "workspace" | "studio" | "knowledge-base" | "dashboard"
  >("workspace");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>("domains");
  const [expandedDomains, setExpandedDomains] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConfiguringTask, setIsConfiguringTask] = useState(false);
  const [isConfiguringAgent, setIsConfiguringAgent] = useState(false);
  const [personalAssistant, setPersonalAssistant] =
    useState<PersonalAssistant | null>(null);
  const [isConfiguringPersonalAssistant, setIsConfiguringPersonalAssistant] =
    useState(false);

  // Creation states
  const [isCreatingDomain, setIsCreatingDomain] = useState(false);
  const [isCreatingSubDomain, setIsCreatingSubDomain] = useState(false);
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  // Form states
  const [newDomain, setNewDomain] = useState({ name: "", description: "" });
  const [newSubDomain, setNewSubDomain] = useState({
    name: "",
    description: "",
    parentId: "",
  });
  const [newApp, setNewApp] = useState({ name: "", description: "" });
  const [newAgent, setNewAgent] = useState({
    name: "",
    role: "",
    specialty: "",
    domainId: "",
  });

  useEffect(() => {
    const fetchPersonalAssistant = async () => {
      try {
        const instancesCheck = await getMyInstancesV2({
          processName: "Configure Personal Assistant",
          predefinedFilters: { taskName: "Personal Assistant Data" },
        });
  
        if (instancesCheck.length > 0) {
          const data = instancesCheck[0].data;
  
          const loadedAssistant: PersonalAssistant = {
            id: "server-loaded-id", // You can customize this
            name: data.name,
            gender: data.gender,
            avatar: data.avatar,
            voice: {
              id: data.voiceId || "en-us-male-1",
              name: data.voice,
              gender: data.gender,
              language: "en-US",
              accent: "General American",
            },
            notificationPreferences: data.preferences || [],
          };
  
          setPersonalAssistant(loadedAssistant);
        }
      } catch (error) {
        console.error("Error loading personal assistant:", error);
      }
    };
  
    fetchPersonalAssistant();
  }, []);

  // Data states
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: "finance",
      name: "Finance",
      icon: <Briefcase className="w-5 h-5" />,
      description: "Financial analysis and planning",
    },
    {
      id: "security",
      name: "Cybersecurity",
      icon: <Shield className="w-5 h-5" />,
      description: "Security monitoring and threat detection",
    },
    {
      id: "database",
      name: "Database",
      icon: <Database className="w-5 h-5" />,
      description: "Database management and optimization",
    },
  ]);

  const [subDomains, setSubDomains] = useState<SubDomain[]>([]);

  const [apps, setApps] = useState<App[]>([]);

  async function getApps() {
    const accountId = await getActiveAccountId();
    const appList = await getAllSubscribedSoftwaresForClient({
      accountId: accountId,
    });
    const newApps = [];
    for (const app of appList) {
      newApps.push({
        id: app.SOFTWARE_ID,
        name: app.SOFTWARE_NAME,
        description: app.SOFTWARE_DESCRIPTION,
        icon: <Shield className="w-5 h-5" />,
      });
    }
    setApps([...newApps]);
  }
  useEffect(() => {
    getApps();
    getAllWorkflows();
  }, []);

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Alex",
      role: "Financial Analyst",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
      status: "active",
      specialty: "Financial Planning & Analysis",
      domainId: "finance",
      appId: "monitoring",
    },
  ]);

  async function getAllWorkflows() {
    const baseUrl = "/api/workflows"; // Replace with your actual instance URL
    const queryParams = new URLSearchParams({
      active: "true", // Optional: filter active workflows
      limit: "100", // Adjust as needed
      excludePinnedData: "true", // Optional
    });

    const apiKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYWJlYmZkYy1jNjMxLTQyMWMtOGJiZi05NzkyMTc0ZWFkODEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQyMjkzODY4fQ.lCjINY84u_71ubR0Un3gVVGYO8FnAgmw7r9G64BqZ2U";
    const headers = {
      "X-N8N-API-KEY": apiKey,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`${baseUrl}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Workflows:", data);
      setAgents([...data.data]);
    } catch (error) {
      console.error("Failed to fetch workflows:", error);
    }
  }

 

  const handleCreateDomain = () => {
    if (!newDomain.name || !newDomain.description) return;

    const domain: Domain = {
      id: newDomain.name.toLowerCase().replace(/\s+/g, "-"),
      name: newDomain.name,
      description: newDomain.description,
      icon: <Briefcase className="w-5 h-5" />,
    };

    setDomains([...domains, domain]);
    setNewDomain({ name: "", description: "" });
    setIsCreatingDomain(false);
  };

  const handleCreateSubDomain = () => {
    if (
      !newSubDomain.name ||
      !newSubDomain.description ||
      !newSubDomain.parentId
    )
      return;

    const subDomain: SubDomain = {
      id: `${newSubDomain.parentId}-${newSubDomain.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
      name: newSubDomain.name,
      description: newSubDomain.description,
      parentId: newSubDomain.parentId,
    };

    setSubDomains([...subDomains, subDomain]);
    setNewSubDomain({ name: "", description: "", parentId: "" });
    setIsCreatingSubDomain(false);
  };

  const handleCreateApp = () => {
    if (!newApp.name || !newApp.description) return;

    const app: App = {
      id: newApp.name.toLowerCase().replace(/\s+/g, "-"),
      name: newApp.name,
      description: newApp.description,
      icon: <Activity className="w-5 h-5" />,
    };

    setApps([...apps, app]);
    setNewApp({ name: "", description: "" });
    setIsCreatingApp(false);
  };

  const handleCreateAgent = () => {
    if (
      !newAgent.name ||
      !newAgent.role ||
      !newAgent.specialty ||
      !newAgent.domainId
    )
      return;

    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      role: newAgent.role,
      specialty: newAgent.specialty,
      domainId: newAgent.domainId,
      subDomainId: newAgent.subDomainId,
      appId: newAgent.appId,
      status: "active",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
    };

    setAgents([...agents, agent]);
    setNewAgent({
      name: "",
      role: "",
      specialty: "",
      domainId: "",
    });
    setIsCreatingAgent(false);
  };

  const handleDeleteDomain = (domainId: string) => {
    const updatedDomains = domains.filter((d) => d.id !== domainId);
    setDomains(updatedDomains);

    const updatedSubDomains = subDomains.filter(
      (sd) => sd.parentId !== domainId
    );
    setSubDomains(updatedSubDomains);

    if (selectedDomain === domainId) {
      setSelectedDomain(null);
    }

    const updatedAgents = agents.filter((agent) => agent.domainId !== domainId);
    setAgents(updatedAgents);
  };

  const handleDeleteSubDomain = (subDomainId: string) => {
    const updatedSubDomains = subDomains.filter((sd) => sd.id !== subDomainId);
    setSubDomains(updatedSubDomains);

    const updatedAgents = agents.map((agent) => {
      if (agent.subDomainId === subDomainId) {
        const { subDomainId, ...rest } = agent;
        return rest;
      }
      return agent;
    });
    setAgents(updatedAgents);
  };

  const handleDeleteApp = (appId: string) => {
    const updatedApps = apps.filter((a) => a.id !== appId);
    setApps(updatedApps);

    if (selectedApp === appId) {
      setSelectedApp(null);
    }

    const updatedAgents = agents.map((agent) => {
      if (agent.appId === appId) {
        const { appId, ...rest } = agent;
        return rest;
      }
      return agent;
    });
    setAgents(updatedAgents);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedAgent) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      agentId: selectedAgent.id,
      content: newMessage,
      timestamp: new Date(),
      type: "outgoing",
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate agent response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        agentId: selectedAgent.id,
        content: `I'm ${selectedAgent.name}, your ${selectedAgent.role}. How can I assist you with ${selectedAgent.specialty}?`,
        timestamp: new Date(),
        type: "incoming",
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const toggleDomainExpansion = (domainId: string) => {
    setExpandedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((id) => id !== domainId)
        : [...prev, domainId]
    );
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  const menuitems: MenuItem[] = [
    {
      title: "Workspace",
      iconName: "bot",
      onClick: () => setView("workspace"),
    },
    {
      title: "Dashboard",
      iconName: "bar-chart",
      onClick: () => setView("dashboard"),
    },
    {
      title: "Agent Studio",
      iconName: "workflow",
      onClick: () => setView("studio"),
    },
    {
      title: "Knowledge Base",
      iconName: "book",
      onClick: () => setView("knowledge-base"),
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <RenderAppSidebar menuItems={menuitems} />

      {/* Personal Assistant Configuration */}
      {!personalAssistant && view === "workspace" && (
        <div className="text-center p-3">
          <h2 className="text-2xl font-semibold text-foreground/90 mb-3">
            Welcome to AI Workforce
          </h2>
          <p className="text-foreground/60 mb-3">
            Let's start by setting up your personal AI assistant
          </p>
          <TextButton
            onClick={() =>{console.log("Opening Personal Assistant...");
              setIsConfiguringPersonalAssistant(true);}}
          //className="bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Configure Personal Assistant
          </TextButton>
        </div>
      )}

      {/* Notification System */}
      {personalAssistant && (
        <NotificationSystem
          personalAssistant={personalAssistant}
          agents={agents}
        />
      )}

      {personalAssistant && view === "workspace" && (
        <div className="text-center p-3">
          <h2 className="text-2xl font-semibold text-foreground/90 mb-3">
            Welcome to AI Workforce
          </h2>
          <p className="text-foreground/60 mb-3">
            Your Personal Assistant is configured.
          </p>
          <TextButton
            onClick={() => setIsConfiguringPersonalAssistant(true)}
            className="rounded-xl px-6 py-2"
          >
            Edit Personal Assistant
          </TextButton>
        </div>
      )}


      {/* Main Content */}
      {view === "studio" && <AgentStudio />}
      {view === "knowledge-base" && <KnowledgeBase />}
      {view === "dashboard" && <Dashboard agents={agents} />}
      {view === "workspace" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-8rem)] overflow-y-auto">
              <CardHeader>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="justify-center"
                  value={viewMode}
                  onValueChange={(value) => {
                    setViewMode(value);
                    if (value === "domains") {
                      setSelectedApp(null);
                    } else {
                      setSelectedDomain(null);
                    }
                  }}
                >
                  <ToggleGroupItem className="rounded-e-none" value="domains">
                    Domains
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="rounded-s-none border-s-0"
                    value="apps"
                  >
                    Apps
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-foreground/90">
                      {viewMode === "domains"
                        ? "Domain Expertise"
                        : "Applications"}
                    </h2>
                    <IconButton
                      onClick={() =>
                        viewMode === "domains"
                          ? setIsCreatingDomain(true)
                          : setIsCreatingApp(true)
                      }
                      //className="p-2 rounded-xl bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
                    >
                      <Plus />
                    </IconButton>
                  </div>

                  {viewMode === "domains" ? (
                    <DomainList
                      domains={domains}
                      subDomains={subDomains}
                      selectedDomain={selectedDomain}
                      expandedDomains={expandedDomains}
                      onDomainSelect={setSelectedDomain}
                      onDomainExpand={toggleDomainExpansion}
                      onDomainDelete={handleDeleteDomain}
                      onSubDomainCreate={(domainId) => {
                        setNewSubDomain((prev) => ({
                          ...prev,
                          parentId: domainId,
                        }));
                        setIsCreatingSubDomain(true);
                      }}
                      onSubDomainDelete={handleDeleteSubDomain}
                    />
                  ) : (
                    <AppList
                      apps={apps}
                      selectedApp={selectedApp}
                      onAppSelect={setSelectedApp}
                      onAppDelete={handleDeleteApp}
                    />
                  )}

                  {/* Creation Forms */}
                  {isCreatingDomain && (
                    <div className="mt-3 p-3  rounded-xl">
                      <div className="space-y-3">
                        <Input
                          type="text"
                          placeholder="Domain Name"
                          value={newDomain.name}
                          onChange={(e) =>
                            setNewDomain({ ...newDomain, name: e.target.value })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <Input
                          type="text"
                          placeholder="Description"
                          value={newDomain.description}
                          onChange={(e) =>
                            setNewDomain({
                              ...newDomain,
                              description: e.target.value,
                            })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <div className="flex gap-3 justify-end">
                          <TextButton
                            onClick={handleCreateDomain}
                            //className="flex-1 bg-blue-500 text-white rounded-xl py-2 hover:bg-blue-600"
                          >
                            Create
                          </TextButton>
                          <TextButton
                            variant={"secondary"}
                            onClick={() => setIsCreatingDomain(false)}
                            //className="flex-1 bg-[#3c3c3e] text-white/90 rounded-xl py-2"
                          >
                            Cancel
                          </TextButton>
                        </div>
                      </div>
                    </div>
                  )}

                  {isCreatingSubDomain && (
                    <div className="mt-3 p-3  rounded-xl">
                      <div className="space-y-3">
                        <Input
                          type="text"
                          placeholder="Sub-Domain Name"
                          value={newSubDomain.name}
                          onChange={(e) =>
                            setNewSubDomain({
                              ...newSubDomain,
                              name: e.target.value,
                            })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <Input
                          type="text"
                          placeholder="Description"
                          value={newSubDomain.description}
                          onChange={(e) =>
                            setNewSubDomain({
                              ...newSubDomain,
                              description: e.target.value,
                            })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <div className="flex gap-3 justify-end">
                          <TextButton
                            onClick={handleCreateSubDomain}
                            //className="flex-1 bg-blue-500 text-white rounded-xl py-2 hover:bg-blue-600"
                          >
                            Create
                          </TextButton>
                          <TextButton
                            variant={"secondary"}
                            onClick={() => setIsCreatingSubDomain(false)}
                            //className="flex-1 bg-[#3c3c3e] text-white/90 rounded-xl py-2"
                          >
                            Cancel
                          </TextButton>
                        </div>
                      </div>
                    </div>
                  )}

                  {isCreatingApp && (
                    <div className="mt-3 p-3 rounded-xl">
                      <div className="space-y-3">
                        <Input
                          type="text"
                          placeholder="App Name"
                          value={newApp.name}
                          onChange={(e) =>
                            setNewApp({ ...newApp, name: e.target.value })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <Input
                          type="text"
                          placeholder="Description"
                          value={newApp.description}
                          onChange={(e) =>
                            setNewApp({
                              ...newApp,
                              description: e.target.value,
                            })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <div className="flex gap-2">
                          <TextButton
                            onClick={handleCreateApp}
                            //className="flex-1 bg-blue-500 text-white rounded-xl py-2 hover:bg-blue-600"
                          >
                            Create
                          </TextButton>
                          <TextButton
                            onClick={() => setIsCreatingApp(false)}
                            //className="flex-1 bg-[#3c3c3e] text-white/90 rounded-xl py-2"
                          >
                            Cancel
                          </TextButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-foreground/90">
                      AI Agents
                    </h2>
                    <IconButton
                      onClick={() => setIsCreatingAgent(true)}
                      // className="p-2 rounded-xl bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
                    >
                      <Plus />
                    </IconButton>
                  </div>

                  <AgentList
                    agents={agents}
                    selectedAgent={selectedAgent}
                    onAgentSelect={setSelectedAgent}
                  />

                  {/* Agent Creation Form */}
                  {isCreatingAgent && (
                    <div className="mt-3 p-3  rounded-xl">
                      <div className="space-y-3">
                        <Input
                          type="text"
                          placeholder="Agent Name"
                          value={newAgent.name}
                          onChange={(e) =>
                            setNewAgent({ ...newAgent, name: e.target.value })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <Input
                          type="text"
                          placeholder="Role"
                          value={newAgent.role}
                          onChange={(e) =>
                            setNewAgent({ ...newAgent, role: e.target.value })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <Input
                          type="text"
                          placeholder="Specialty"
                          value={newAgent.specialty}
                          onChange={(e) =>
                            setNewAgent({
                              ...newAgent,
                              specialty: e.target.value,
                            })
                          }
                          //className="w-full bg-[#3c3c3e] rounded-xl px-3 py-2 text-white/90 placeholder:text-white/40"
                        />
                        <Select
                          value={newAgent.domainId}
                          onValueChange={(value) =>
                            setNewAgent({ ...newAgent, domainId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Domain" />
                          </SelectTrigger>
                          <SelectContent>
                            {domains.map((domain) => (
                              <SelectItem key={domain.id} value={domain.id}>
                                {domain.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex gap-3 justify-end">
                          <TextButton
                            onClick={handleCreateAgent}
                            //className="flex-1 bg-blue-500 text-white rounded-xl py-2 hover:bg-blue-600"
                          >
                            Create
                          </TextButton>
                          <TextButton
                            variant={"secondary"}
                            onClick={() => setIsCreatingAgent(false)}
                            //className="flex-1 bg-[#3c3c3e] text-white/90 rounded-xl py-2"
                          >
                            Cancel
                          </TextButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            {selectedAgent ? (
              <ChatWindow
                agent={selectedAgent}
                messages={messages.filter(
                  (m) => m.agentId === selectedAgent.id
                )}
                newMessage={newMessage}
                isListening={isListening}
                showAnalytics={showAnalytics}
                onMessageChange={setNewMessage}
                onMessageSend={handleSendMessage}
                onToggleVoice={toggleVoice}
                onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
                onConfigureTask={() => setIsConfiguringTask(true)}
                onConfigureAgent={() => setIsConfiguringAgent(true)}
                onClose={() => setSelectedAgent(null)}
              />
            ) : (
              <Card className="h-[calc(100vh-8rem)]">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="w-16 h-16 text-foreground/20 mx-auto mb-3" />
                    <h2 className="text-xl font-semibold text-foreground/90 mb-2">
                      Select an Agent
                    </h2>
                    <p className="text-foreground/60">
                      Choose an AI agent to start a conversation
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {isConfiguringTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <TaskConfigurator
            onSave={(task) => {
              setIsConfiguringTask(false);
            }}
            onCancel={() => setIsConfiguringTask(false)}
          />
        </div>
      )}

      {isConfiguringAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <AgentConfigurator
            config={{
              language: "en",
              responseStyle: "concise",
              autonomyLevel: "supervised",
              learningEnabled: true,
              maxConcurrentTasks: 3,
              allowedActions: ["message", "query", "analyze"],
            }}
            onSave={(config) => {
              setIsConfiguringAgent(false);
            }}
            onCancel={() => setIsConfiguringAgent(false)}
          />
        </div>
      )}

      {isConfiguringPersonalAssistant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50">
          <PersonalAssistantConfigurator 
            agents={agents}
            existingAssistant={personalAssistant}
            onSave={(assistant) => {
              setPersonalAssistant(assistant);
              setIsConfiguringPersonalAssistant(false);
            }}
            open={isConfiguringPersonalAssistant} // ✅ Ensure this is a boolean
            onClose={() => setIsConfiguringPersonalAssistant(false)} // ✅ Ensure this is a function
          />
        </div>
      )}
    </div>
  );
}

export default App;
