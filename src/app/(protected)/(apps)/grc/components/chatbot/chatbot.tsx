// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/shadcn/ui/button"
// import { Card } from "@/shadcn/ui/card"
// import { Input } from "@/shadcn/ui/input"
// import { ScrollArea } from "@/shadcn/ui/scroll-area"
// import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar"
// import { MessageCircle, Send, X, Minimize2, Maximize2, Mic, Volume2, VolumeX } from "lucide-react"
// import { useToast } from "../../hooks/use-toast"
// import { format, isFuture, isPast } from "date-fns"

// interface Message {
//   id: string
//   type: 'user' | 'assistant'
//   content: string
//   timestamp: Date
// }

// export function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isMinimized, setIsMinimized] = useState(false)
//   const [messages, setMessages] = useState<Message[]>([])
//   const [input, setInput] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const [isMuted, setIsMuted] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const { toast } = useToast()

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   useEffect(() => {
//     if (messages.length === 0) {
//       // Add welcome message
//       const welcomeMessage: Message = {
//         id: 'welcome',
//         type: 'assistant',
//         content: "Hello! I'm IKON Assistant, your AI assistant for all GRC matters. I can help you with:\n\n" +
//                 "• Upcoming audits and deadlines\n" +
//                 "• Risk assessments and status\n" +
//                 "• Compliance requirements\n" +
//                 "• Policy information\n\n" +
//                 "How can I assist you today?",
//         timestamp: new Date()
//       }
//       setMessages([welcomeMessage])
//     }
//   }, [])

//   const formatDate = (date: Date) => {
//     if (isPast(date)) {
//       return `${format(date, 'MMM d, yyyy')} (Past)`
//     } else if (isFuture(date)) {
//       return `${format(date, 'MMM d, yyyy')} (Upcoming)`
//     }
//     return format(date, 'MMM d, yyyy')
//   }

//   const handleSend = async () => {
//     if (!input.trim()) return

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: input,
//       timestamp: new Date()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInput("")
//     setIsLoading(true)

//     const handleGenerateRes = async () => {
//       if (!input.trim()) return
//       const newMessage = { id: Date.now(), type: 'user', content: input, timestamp: new Date() }
//       const updatedMessages = [...messages, newMessage]
//       setMessages(updatedMessages)
//       setInput("")
//       setIsLoading(true)

//       try {
//         const response = await fetch(
//           "https://ikoncloud-dev.keross.com/aiagent/webhook/fc1d5b7c-aa49-448f-a1f1-64ed944d7b57",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             //body: JSON.stringify({ docs: input }), // sending user message
//             body: JSON.stringify({ chatInput: input }),
//           }
//         )
//         const data = await response.json();
//         console.log("Response:", data);
//         const botMessage = {
//           id: Date.now() + 1,
//           type: 'bot',
//           content: data[0]?.output || "No response received.",
//           timestamp: new Date(),
//         }
//         setMessages(prev => [...prev, botMessage])
//         toast.success("Message sent.")
//       } catch (error) {
//         console.error("Error:", error)
//         toast.error("Failed to send.")
//       } finally {
//         setIsLoading(false)
//         scrollToBottom()
//       }
//     }

//     try {
//       const response = await handleGenerateRes()

//       const assistantMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'assistant',
//         content: response,
//         timestamp: new Date()
//       }

//       setMessages(prev => [...prev, assistantMessage])

//       if (!isMuted) {
//         speakResponse(response)
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to get response. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const generateResponse = async (query: string): Promise<string> => {
//     await new Promise(resolve => setTimeout(resolve, 1000))
//     const lowerQuery = query.toLowerCase()

//     // Sophisticated response mapping
//     if (lowerQuery.includes('audit')) {
//       if (lowerQuery.includes('next') || lowerQuery.includes('upcoming')) {
//         return "The next scheduled audits are:\n\n" +
//                `1. Internal Security Audit - ${formatDate(new Date('2024-04-15'))}\n` +
//                `2. Compliance Review - ${formatDate(new Date('2024-05-01'))}\n` +
//                `3. Vendor Assessment - ${formatDate(new Date('2024-05-15'))}\n\n` +
//                "There are currently 3 open findings that require attention, with 2 high-priority items due this month. Would you like me to show you the details of these findings?"
//       } else if (lowerQuery.includes('finding') || lowerQuery.includes('issue')) {
//         return "Current audit findings status:\n\n" +
//                "• High Priority: 2 findings\n" +
//                "  - Access Control Policy Implementation\n" +
//                "  - Third-party Risk Assessment\n\n" +
//                "• Medium Priority: 3 findings\n" +
//                "• Low Priority: 5 findings\n\n" +
//                "The oldest high-priority finding is 45 days old. Would you like to see the remediation plans?"
//       }
//     } else if (lowerQuery.includes('risk')) {
//       if (lowerQuery.includes('high') || lowerQuery.includes('critical')) {
//         return "High/Critical Risk Summary:\n\n" +
//                "• 3 Critical Risks:\n" +
//                "  - Data Breach Vulnerability\n" +
//                "  - Supply Chain Disruption\n" +
//                "  - Regulatory Non-compliance\n\n" +
//                "• 5 High Risks:\n" +
//                "  - System Availability\n" +
//                "  - Third-party Security\n" +
//                "  - Operational Resilience\n\n" +
//                "All critical risks have active mitigation plans. Would you like to review them?"
//       } else if (lowerQuery.includes('status') || lowerQuery.includes('update')) {
//         return "Current Risk Management Status:\n\n" +
//                "• Total Risks: 45\n" +
//                "• Risk Distribution:\n" +
//                "  - Critical: 3 (↓1 from last month)\n" +
//                "  - High: 5 (↓2 from last month)\n" +
//                "  - Medium: 18\n" +
//                "  - Low: 19\n\n" +
//                "Risk score has improved by 15% since last quarter. Would you like to see the trend analysis?"
//       }
//     } else if (lowerQuery.includes('compliance')) {
//       if (lowerQuery.includes('deadline') || lowerQuery.includes('due')) {
//         return "Upcoming Compliance Deadlines:\n\n" +
//                `1. GDPR Annual Review - Due ${formatDate(new Date('2024-04-20'))} (15 days remaining)\n` +
//                `2. ISO 27001 Controls Assessment - Due ${formatDate(new Date('2024-05-01'))}\n` +
//                `3. PCI DSS Quarterly Scan - Due ${formatDate(new Date('2024-05-15'))}\n\n` +
//                "Would you like me to show you the requirements for any of these items?"
//       } else if (lowerQuery.includes('rate') || lowerQuery.includes('status')) {
//         return "Compliance Status Overview:\n\n" +
//                "• Overall Compliance Rate: 92%\n" +
//                "• Framework Compliance:\n" +
//                "  - ISO 27001: 94%\n" +
//                "  - GDPR: 96%\n" +
//                "  - PCI DSS: 89%\n\n" +
//                "There are 5 controls requiring immediate attention. Should I list them for you?"
//       }
//     } else if (lowerQuery.includes('policy')) {
//       if (lowerQuery.includes('review') || lowerQuery.includes('update')) {
//         return "Policy Review Status:\n\n" +
//                "• Policies Due for Review: 8\n" +
//                "• Recently Updated: 12\n" +
//                "• Key Policies Requiring Attention:\n" +
//                "  1. Information Security Policy\n" +
//                "  2. Data Protection Policy\n" +
//                "  3. Acceptable Use Policy\n\n" +
//                "Would you like to see the review schedule?"
//       }
//     }

//     return "I can help you with detailed information about:\n\n" +
//            "• Audit schedules and findings\n" +
//            "• Risk assessments and mitigation plans\n" +
//            "• Compliance requirements and deadlines\n" +
//            "• Policy reviews and updates\n\n" +
//            "Please let me know what specific information you need."
//   }


//   const startListening = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       toast({
//         title: "Not Supported",
//         description: "Voice recognition is not supported in your browser.",
//         variant: "destructive"
//       })
//       return
//     }

//     const recognition = new (window as any).webkitSpeechRecognition()
//     recognition.continuous = false
//     recognition.interimResults = false

//     recognition.onstart = () => {
//       setIsListening(true)
//     }

//     recognition.onresult = (event: any) => {
//       const transcript = event.results[0][0].transcript
//       setInput(transcript)
//       handleSend()
//     }

//     recognition.onerror = (event: any) => {
//       console.error('Speech recognition error:', event.error)
//       setIsListening(false)
//     }

//     recognition.onend = () => {
//       setIsListening(false)
//     }

//     recognition.start()
//   }

//   const speakResponse = (text: string) => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(text)
//       utterance.rate = 0.9
//       utterance.pitch = 1
//       window.speechSynthesis.speak(utterance)
//     }
//   }

// if (!isOpen) {
//   return (
//     <Button
//       className="fixed bottom-4 right-4 h-12 w-12 rounded-full"
//       onClick={() => setIsOpen(true)}
//     >
//       <MessageCircle className="h-6 w-6" />
//     </Button>
//   )
// }

//   return (
//     <Card className={`fixed bottom-4 right-4 w-[400px] shadow-lg transition-all ${
//       isMinimized ? 'h-[60px]' : 'h-[600px]'
//     }`}>
//       <div className="flex items-center justify-between border-b p-4">
//         <div className="flex items-center gap-2">
//           <Avatar>
//             <AvatarImage src="/ikon-assistant.png" alt="IKON Assistant" />
//             <AvatarFallback>IA</AvatarFallback>
//           </Avatar>
//           <div>
//             <h3 className="font-semibold">IKON Assistant</h3>
//             <p className="text-xs text-muted-foreground">AI GRC Assistant</p>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsMuted(!isMuted)}
//             title={isMuted ? "Unmute" : "Mute"}
//           >
//             {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsMinimized(!isMinimized)}
//           >
//             {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsOpen(false)}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {!isMinimized && (
//         <>
//           <ScrollArea className="flex-1 h-[calc(600px-132px)]">
//             <div className="p-4 space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${
//                     message.type === 'user' ? 'justify-end' : 'justify-start'
//                   }`}
//                 >
//                   <div
//                     className={`rounded-lg px-4 py-2 max-w-[80%] ${
//                       message.type === 'user'
//                         ? 'bg-primary text-primary-foreground'
//                         : 'bg-muted'
//                     }`}
//                   >
//                     <p className="text-sm whitespace-pre-line">{message.content}</p>
//                     <p className="text-xs opacity-70 mt-1">
//                       {format(message.timestamp, 'HH:mm')}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//           </ScrollArea>

//           <div className="border-t p-4">
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault()
//                 handleSend()
//               }}
//               className="flex gap-2"
//             >
//               <Input
//                 placeholder="Type your message..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 disabled={isLoading || isListening}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="icon"
//                 disabled={isLoading}
//                 onClick={startListening}
//                 className={isListening ? "animate-pulse bg-red-100" : ""}
//               >
//                 <Mic className="h-4 w-4" />
//               </Button>
//               <Button type="submit" disabled={isLoading || isListening}>
//                 <Send className="h-4 w-4" />
//               </Button>
//             </form>
//           </div>
//         </>
//       )}
//     </Card>
//   )
// }



'use client'

import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/shadcn/ui/button"
import { Card } from "@/shadcn/ui/card"
import { Input } from "@/shadcn/ui/input"
import { ScrollArea } from "@/shadcn/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar"
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react"
import { format } from "date-fns"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const Chatbot = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [isMuted, setIsMuted] = useState(false)
  //const [isMinimized, setIsMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          content: "Hello! How can I assist you?",
          loading: false,
          timestamp: new Date()
        }
      ])
      setHasInitialized(true)
    }
  }, [isOpen, hasInitialized])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    const loadingId = Date.now() + 1
    const loadingMessage = {
      id: loadingId,
      type: 'bot',
      content: "",
      loading: true,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/fc1d5b7c-aa49-448f-a1f1-64ed944d7b57",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatInput: input }),
        }
      )
      const data = await response.json()
      console.log("Response:", data)

      const botMessage = {
        id: loadingId,
        type: 'bot',
        content: data[0]?.output || "No response received from the assistant.",
        loading: false,
        timestamp: new Date()
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingId ? botMessage : msg))
      )
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingId))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-[1200px] shadow-lg z-10 transition-all h-[600px]`}>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/ikon-assistant.png" alt="IKON Assistant" />
            <AvatarFallback>IA</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">IKON Assistant</h3>
            <p className="text-xs text-muted-foreground">AI GRC Assistant</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* {!isMinimized && ( */}
      <>
        <ScrollArea className="flex-1 h-[calc(600px-132px)]">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                    }`}
                >
                  {message.loading ? (
                    <div className="flex space-x-1 items-center justify-start">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    </div>
                  ) : (
                    <>
                      {/* <p className="text-sm whitespace-pre-line">{message.content}</p> */}
                      {/* <p className="text-sm whitespace-pre-line"><ReactMarkdown>{message.content}</ReactMarkdown></p> */}
                      <p className="text-sm whitespace-pre-line"><ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown></p>
                      <p className="text-xs opacity-70 mt-1">
                        {format(message.timestamp, 'HH:mm')}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isListening}
            />
            <Button
              type="submit"
              disabled={isLoading || isListening}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </>
      {/* )} */}
    </Card>
  )
}




