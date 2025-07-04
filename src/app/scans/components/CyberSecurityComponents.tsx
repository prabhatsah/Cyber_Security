import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bot,
  BrainCircuit,
  Calendar,
  Clock,
  GlobeLock,
  Play,
  ScanSearch,
  Search,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@tremor/react";
import { SkeletonCard } from "./Skeleton";
import CustomisedLoading from "@/components/CustomisedLoading";

interface AIAgent {
  id: string;
  name: string;
  role: string;
  icon: typeof BrainCircuit;
  expertise: string[];
  description: string;
  route: string;
}

interface ScanSchedule {
  id: string;
  agentId: string;
  frequency: "once" | "daily" | "weekly" | "monthly";
  nextRun: Date;
  lastRun?: Date;
  status: "pending" | "running" | "completed" | "failed";
}

const comps: AIAgent[] = [
  // {
  //   id: "vuln-scan",
  //   name: "Vulnerability Scanning",
  //   role: "Security Analyst",
  //   icon: ScanSearch,
  //   expertise: [
  //     "Automated vulnerability scanning",
  //     "Risk assessment & prioritization",
  //     "Patch management strategies & Compliance auditing",
  //   ],
  //   description:
  //     "Vulnerability scanning is the process of systematically scanning systems, networks, and applications to identify security weaknesses. It helps organizations detect and address potential threats before they can be exploited by attackers.",
  //   route: "/scans/vulnerabilityScan",
  // },
  // {
  //   id: "pen-test",
  //   name: "Penetration Testing",
  //   role: "Ethical Hacker",
  //   icon: ShieldAlert,
  //   expertise: [
  //     "Exploiting vulnerabilities & Red teaming",
  //     "Privilege escalation & Post-exploitation techniques",
  //     "Reporting & remediation",
  //   ],
  //   description:
  //     "Simulating real-world attacks to identify and exploit security weaknesses, helping organizations strengthen their defenses.",
  //   route: "/scans/penTest",
  // },
  {
    id: "network-intrusion-detection",
    name: "Network & Intrusion Detection",
    role: "Network Security Engineer",
    icon: ShieldAlert,
    expertise: [
      "Intrusion detection & prevention",
      "Network traffic monitoring & Anomaly detection",
      "Signature-based threat detection & SIEM integration",
    ],
    description:
      "Monitoring and analyzing network traffic to detect and prevent security threats.",
    route: "/scans/networkIntrusion",
  },
  {
    id: "web-api-security",
    name: "Web & API Security",
    role: "Application Security Engineer",
    icon: GlobeLock,
    expertise: [
      "Web application firewalls (WAF)",
      "API security best practices",
      "Authentication, authorization & Secure coding practices",
    ],
    description:
      "Ensuring security of web applications and APIs against vulnerabilities and attacks.",
    route: "/scans/WebApi",
  },
  {
    id: "cloud-container-security",
    name: "Cloud & Container Security",
    role: "Cloud Security Engineer",
    icon: ServerCog,
    expertise: [
      "Cloud security architecture",
      "Container & Kubernetes security best practices",
      "IAM & access controls",
    ],
    description:
      "Securing cloud environments and containerized applications from threats and misconfigurations.",
    route: "/scans/cloudContainer",
  },
  {
    id: "endpoint-malware-analysis",
    name: "Endpoint Security & Malware Analysis",
    role: "Endpoint Security Engineer",
    icon: ShieldCheck,
    expertise: [
      "Endpoint detection & response (EDR)",
      "Malware reverse engineering & Threat intelligence correlation",
      "Behavioral analysis, Ransomware protection",
    ],
    description:
      "Protecting endpoints from malware and analyzing threats for prevention and mitigation.",
    route: "/scans/endpointMalware",
  },
  {
    id: "active-directory-security",
    name: "Active Directory Security",
    role: "Identity & Access Management Engineer",
    icon: Users,
    expertise: [
      "AD hardening & auditing",
      "Kerberos authentication security",
      "Privileged access management & Lateral movement detection",
      "Lateral movement detection",
    ],
    description:
      "Securing Active Directory environments against privilege escalation and unauthorized access.",
    route: "/scans/activeDirectory",
  },
  {
    id: "osint-threat-intelligence",
    name: "OSINT & Threat Intelligence",
    role: "Threat Intelligence Analyst",
    icon: Search,
    expertise: [
      "Open-source intelligence (OSINT) & Threat actor profiling",
      "Dark web monitoring ",
      "Threat hunting techniques",
    ],
    description:
      "Gathering and analyzing intelligence to identify emerging cyber threats and attack vectors.",
    route: "/scans/OSINT",
  },
  {
    id: "soar-security-automation",
    name: "Security Orchestration & Automation (SOAR)",
    role: "Security Automation Engineer",
    icon: Workflow,
    expertise: [
      "Incident response automation",
      "SIEM integration & Playbook development",
      "Threat intelligence enrichment & Security workflow automation",
    ],
    description:
      "Automating security operations to improve response time and efficiency in threat management.",
    route: "/scans/SOAR",
  },
  {
    id: "ai-driven-security-analysis",
    name: "AI-Driven Security Analysis",
    role: "AI Security Engineer",
    icon: BrainCircuit,
    expertise: [
      "AI-based anomaly detection & Automated threat classification",
      "AI-powered phishing detection",
      "Behavioral analytics & Machine learning for cybersecurity",
    ],
    description:
      "Leveraging AI and machine learning to enhance security analysis and threat detection.",
    route: "/scans/aiDrivenAnalysis",
  },
];

export default function CyberSecurityComponents() {
  const router = useRouter();

  const handleClick = async (route: string) => {
    //router.push(route);
    setIsLoadingForInnerComponent(true);

    setTimeout(() => {
      router.push(route);
    }, 2000); // delay for better UX (simulate load time)
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingForInnerComponent, setIsLoadingForInnerComponent] =
    useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [schedules, setSchedules] = useState<ScanSchedule[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    frequency: "once" as const,
    nextRun: new Date(),
  });

  const handleScheduleScan = (agentId: string) => {
    const schedule: ScanSchedule = {
      id: crypto.randomUUID(),
      agentId,
      frequency: newSchedule.frequency,
      nextRun: newSchedule.nextRun,
      status: "pending",
    };

    setSchedules((prev) => [...prev, schedule]);
    setShowScheduleForm(false);
    setNewSchedule({ frequency: "once", nextRun: new Date() });
  };

  const handleStartScan = (agentId: string) => {
    const schedule: ScanSchedule = {
      id: crypto.randomUUID(),
      agentId,
      frequency: "once",
      nextRun: new Date(),
      status: "running",
    };

    setSchedules((prev) => [...prev, schedule]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup the timeout in case the component unmounts before 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonCard />;
  }
  if (isLoadingForInnerComponent) {
    return <CustomisedLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comps.map((agent) => (
          <Card
            key={agent.id}
            className="relative flex flex-col rounded-lg justify-between dark:bg-dark-bgPrimary
               hover:bg-tremor-background-muted 
               hover:dark:bg-dark-tremor-background-muted"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span
                  className="flex size-12 shrink-0 items-center 
                justify-center text-primary rounded-md border 
                border-tremor-border p-1 dark:border-dark-tremor-border"
                >
                  <agent.icon className="" />
                </span>
                <dt
                  className="text-widget-mainHeader"
                >
                  <a className="focus:outline-none">
                    <span className="absolute " aria-hidden={true} />
                    {agent.name}
                  </a>
                  <p className="text-sm text-widget-mainDesc">{agent.role}</p>
                </dt>
              </div>
              <button
                onClick={() => setSelectedAgent(agent)}
                className="text-primary hover:text-primary/80"
              >
                <Bot className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <h4
                className="text-widget-secondaryheader"
              >
                Expertise
              </h4>
              <ul className="mt-2 space-y-1">
                {agent.expertise.map((skill, index) => (
                  <li
                    key={index}
                    className="text-sm leading-6 
                  text-tremor-content dark:text-dark-tremor-content"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => handleClick(agent.route)}
                className="flex-1 btn-primary"
              >
                <Play className="h-4 w-4 mr-2" />
                Proceed
              </button>
              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  // setShowScheduleForm(true);
                }}
                className="flex-1 dark:bg-dark-bgTertiary btn-primary"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Active Scans */}
      {schedules.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Active & Scheduled Scans
          </h2>
          <div className="bg-white shadow-sm rounded-lg divide-y">
            {schedules.map((schedule) => {
              const agent = comps.find((a) => a.id === schedule.agentId);
              if (!agent) return null;

              return (
                <div
                  key={schedule.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${schedule.status === "running"
                          ? "bg-blue-50"
                          : schedule.status === "completed"
                            ? "bg-green-50"
                            : schedule.status === "failed"
                              ? "bg-red-50"
                              : "bg-gray-50"
                        }`}
                    >
                      <agent.icon
                        className={`h-5 w-5 ${schedule.status === "running"
                            ? "text-blue-600"
                            : schedule.status === "completed"
                              ? "text-green-600"
                              : schedule.status === "failed"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {agent.name} - {schedule.frequency} scan
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          Next run: {schedule.nextRun.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${schedule.status === "running"
                        ? "bg-blue-100 text-blue-800"
                        : schedule.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : schedule.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {schedule.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && selectedAgent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Schedule Scan with {selectedAgent.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      frequency: e.target.value as ScanSchedule["frequency"],
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Next Run
                </label>
                <input
                  type="datetime-local"
                  value={newSchedule.nextRun.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      nextRun: new Date(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleScheduleScan(selectedAgent.id)}
                className="btn-primary"
              >
                Schedule Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && !showScheduleForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <selectedAgent.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedAgent.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedAgent.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <AlertTriangle className="h-5 w-5" />
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <p>{selectedAgent.description}</p>
              <h4>Key Capabilities:</h4>
              <ul>
                {selectedAgent.expertise.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAgent(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => handleStartScan(selectedAgent.id)}
                className="btn-primary"
              >
                Start Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
