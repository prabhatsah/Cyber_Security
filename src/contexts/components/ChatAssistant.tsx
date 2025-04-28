import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Maximize2, Minimize2, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const securityResponses = {
  greetings: [
    "Hello! I'm your security assistant. How can I help you today?",
    "Welcome! I'm here to help with your security questions.",
    "Hi there! Need help with security assessments or vulnerability management?",
  ],
  default: "I'm not sure about that. Could you try rephrasing your question?",
  keywords: {
    'scan': "To start a new scan, you can use either the Quick Scan or Port Scan options from the Scans page. Would you like me to explain the difference between these scan types?",
    'vulnerability': "I can help you understand vulnerabilities and their impact. We categorize vulnerabilities by severity (Critical, High, Medium, Low) and provide CVSS scores. Would you like to learn more about a specific type?",
    'report': "You can generate detailed security reports from the Reports page. These include vulnerability findings, remediation steps, and trend analysis. Would you like to know how to create a specific type of report?",
    'security': "Security is our top priority. We offer various security assessment tools including vulnerability scanning, port scanning, and continuous monitoring. What specific aspect would you like to know more about?",
    'password': "Strong passwords are crucial for security. We recommend using passwords that are:\n- At least 12 characters long\n- Include numbers, symbols, and mixed case letters\n- Unique for each service\nWould you like more password security tips?",
    'encryption': "We support industry-standard encryption protocols and help identify weak encryption in your systems. This includes checking for:\n- SSL/TLS configuration\n- Cipher strength\n- Protocol versions\nNeed more details about encryption?",
    'compliance': "Our platform helps maintain security compliance through:\n- Regular security assessments\n- Detailed audit logs\n- Compliance reporting\nWhich compliance standard are you interested in?",
    'firewall': "Firewall security is essential. We can help you:\n- Identify open ports\n- Detect misconfigurations\n- Recommend secure rules\nWould you like a firewall security assessment?",
    'backup': "Regular backups are crucial for security. Best practices include:\n- Daily incremental backups\n- Weekly full backups\n- Encrypted backup storage\n- Regular restore testing\nNeed help with backup strategy?",
    'audit': "Our audit logging tracks:\n- Security events\n- User actions\n- System changes\n- Scan results\nYou can view the complete audit trail in the Audit Log section.",
  }
};

function findBestResponse(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  // Check for greetings
  if (lowercaseInput.match(/^(hi|hello|hey|greetings)/)) {
    return securityResponses.greetings[Math.floor(Math.random() * securityResponses.greetings.length)];
  }
  
  // Check for keywords
  for (const [keyword, response] of Object.entries(securityResponses.keywords)) {
    if (lowercaseInput.includes(keyword)) {
      return response;
    }
  }
  
  return securityResponses.default;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: securityResponses.greetings[0],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      role: 'assistant',
      content: findBestResponse(input),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed right-4 bottom-4 bg-white rounded-lg shadow-xl transition-all duration-200 ease-in-out ${
        isMinimized ? 'w-72 h-14' : 'w-96 h-[600px]'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <h3 className="font-medium text-gray-900">Security Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMinimized ? (
              <Maximize2 className="h-5 w-5" />
            ) : (
              <Minimize2 className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[calc(600px-8rem)]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <ReactMarkdown
                    className={`text-sm ${
                      message.role === 'user' ? 'text-white' : 'text-gray-900'
                    } prose prose-sm max-w-none`}
                  >
                    {message.content}
                  </ReactMarkdown>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your security question..."
                className="flex-1 form-input text-sm"
              />
              <button
                type="submit"
                className="p-2 text-primary hover:text-primary/80 disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}