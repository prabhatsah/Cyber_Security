"use client"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent } from "@/shadcn/ui/card"
import { Progress } from "@/shadcn/ui/progress"
import {
  CheckCircle2,
  Building,
  Layers,
  Cog,
  Search,
  ServerCog,
  ListTree,
  BarChart4,
  ArrowRight,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/shadcn/ui/badge"
import Link from "next/link"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

export function CompletionStep() {
  const [setupProgress, setSetupProgress] = useState(0)
  const [setupStep, setSetupStep] = useState(0)
  const [setupComplete, setSetupComplete] = useState(false)
  const [setupMessages, setSetupMessages] = useState<string[]>([])
  
  // Simulate setup progress
  useEffect(() => {
    if (setupStep === 0) {
      const interval = setInterval(() => {
        setSetupProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setSetupStep(1)
            return 100
          }
          return prev + 4
        })
      }, 150)
      
      // Add setup messages as the progress increases
      const messageIntervals = [
        { percent: 5, message: "Creating building configuration..." },
        { percent: 20, message: "Setting up floor layouts..." },
        { percent: 35, message: "Configuring HVAC systems..." },
        { percent: 50, message: "Setting up lighting controls..." },
        { percent: 65, message: "Configuring access control systems..." },
        { percent: 80, message: "Preparing device discovery settings..." },
        { percent: 95, message: "Finalizing building setup..." },
      ]
      
      messageIntervals.forEach(({ percent, message }) => {
        setTimeout(() => {
          setSetupMessages(prev => [...prev, message])
        }, (percent / 100) * 150 * 25)
      })
      
      return () => clearInterval(interval)
    }
    
    if (setupStep === 1) {
      // Simulate discovery process
      setTimeout(() => {
        setSetupMessages(prev => [...prev, "Starting BACnet device discovery..."])
        
        setTimeout(() => {
          setSetupMessages(prev => [...prev, "Discovered BACnet router (Device ID: 123456)"])
          
          setTimeout(() => {
            setSetupMessages(prev => [...prev, "Discovered 3 BACnet controllers"])
            
            setTimeout(() => {
              setSetupMessages(prev => [...prev, "Parsing 142 BACnet objects..."])
              
              setTimeout(() => {
                setSetupMessages(prev => [...prev, "Applying AI tags to data points..."])
                
                setTimeout(() => {
                  setSetupMessages(prev => [...prev, "Building hierarchical data structure..."])
                  
                  setTimeout(() => {
                    setSetupMessages(prev => [...prev, "All systems successfully configured!"])
                    setSetupComplete(true)
                  }, 1500)
                }, 1500)
              }, 1500)
            }, 1500)
          }, 1500)
        }, 1500)
      }, 1000)
    }
  }, [setupStep])
  
  const setupSteps = [
    {
      title: "Building Details",
      icon: Building,
      status: "complete"
    },
    {
      title: "Floor Configuration",
      icon: Layers,
      status: "complete"
    },
    {
      title: "Systems Setup",
      icon: Cog,
      status: "complete"
    },
    {
      title: "Device Discovery",
      icon: Search,
      status: setupComplete ? "complete" : "in-progress"
    },
    {
      title: "Data Point Setup",
      icon: ServerCog,
      status: setupComplete ? "complete" : "pending"
    },
    {
      title: "Tag & Organize",
      icon: ListTree,
      status: setupComplete ? "complete" : "pending"
    },
    {
      title: "Dashboard Setup",
      icon: BarChart4,
      status: setupComplete ? "complete" : "pending"
    },
  ]
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "pending":
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />
      default:
        return null
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">Complete</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">In Progress</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Building Setup Complete!</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Your building has been configured and is now being set up in the system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-7">
          <CardContent className="p-6">
            <h3 className="text-base font-medium mb-4">Setup Progress</h3>
            
            {!setupComplete ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{setupStep === 0 ? `${setupProgress}%` : 'Discovering devices...'}</span>
                  </div>
                  <Progress value={setupProgress} className="h-2" />
                </div>
                
                <ScrollArea className="h-[220px] border rounded-md p-4">
                  <div className="space-y-2">
                    {setupMessages.map((message, index) => (
                      <div key={index} className="flex items-start space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="text-sm">{message}</span>
                      </div>
                    ))}
                    
                    {!setupComplete && setupMessages.length > 0 && (
                      <div className="flex items-start space-x-2 animate-pulse">
                        <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                        </div>
                        <span className="text-sm">Processing...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Setup complete</h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                        <p>Your building has been successfully configured. All systems are ready to use.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <ServerCog className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm font-medium">142</div>
                      <div className="text-xs text-muted-foreground">Data Points Configured</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <Cog className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm font-medium">3</div>
                      <div className="text-xs text-muted-foreground">Building Systems</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <Layers className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm font-medium">3</div>
                      <div className="text-xs text-muted-foreground">Floors Configured</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <Search className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm font-medium">4</div>
                      <div className="text-xs text-muted-foreground">Devices Discovered</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex items-center justify-between pt-4 border-t">
              {!setupComplete ? (
                <div className="flex items-center text-sm text-muted-foreground">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  <span>Setting up your building...</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Link className="mr-2 h-4 w-4" />
                  <span>All systems are now connected.</span>
                </div>
              )}
              
              <Link href="/" legacyBehavior>
                <Button disabled={!setupComplete}>
                  {setupComplete ? 'View Dashboard' : 'Please wait...'}
                  {setupComplete && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-5">
          <CardContent className="p-6">
            <h3 className="text-base font-medium mb-4">Setup Steps</h3>
            
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <step.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{step.title}</span>
                      </div>
                      {getStatusBadge(step.status)}
                    </div>
                    
                    {index < setupSteps.length - 1 && (
                      <div className="mt-1 ml-1.5 h-6 w-px bg-border" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Next Steps</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="h-5 w-5 flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                  </div>
                  <span className="ml-2">Explore your building dashboard</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                  </div>
                  <span className="ml-2">Configure alerts and notifications</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                  </div>
                  <span className="ml-2">Set up user permissions and access</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                  </div>
                  <span className="ml-2">Create custom dashboards and reports</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}