import React from 'react';
import { X, BarChart, Plus, Settings, Mic, MicOff } from 'lucide-react';
import type { Agent, Message } from '../../types/agent';
import { Card, CardContent } from '@/shadcn/ui/card';
import { IconButton, IconButtonWithTooltip, TextButton } from '@/ikon/components/buttons';
import { Input } from '@/shadcn/ui/input';

interface ChatWindowProps {
  agent: Agent;
  messages: Message[];
  newMessage: string;
  isListening: boolean;
  showAnalytics: boolean;
  onMessageChange: (message: string) => void;
  onMessageSend: () => void;
  onToggleVoice: () => void;
  onToggleAnalytics: () => void;
  onConfigureTask: () => void;
  onConfigureAgent: () => void;
  onClose: () => void;
}

export function ChatWindow({
  agent,
  messages,
  newMessage,
  isListening,
  showAnalytics,
  onMessageChange,
  onMessageSend,
  onToggleVoice,
  onToggleAnalytics,
  onConfigureTask,
  onConfigureAgent,
  onClose
}: ChatWindowProps) {
  return (
    <Card className='h-[calc(100vh-8rem)]'>
      <CardContent className='h-full flex flex-col'>
        <div className="p-3 border-b sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-10 h-10 rounded-2xl ring-2 ring-[#3c3c3e]"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1c1c1e] ${agent.status === 'active'
                    ? 'bg-green-400'
                    : agent.status === 'idle'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                    }`}
                />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-lg text-foreground/90">{agent.name}</h3>
                <p className="text-sm text-foreground/60">{agent.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconButtonWithTooltip
                onClick={onToggleAnalytics}

                tooltipContent="Analytics"
              >
                <BarChart />
              </IconButtonWithTooltip>
              <IconButtonWithTooltip
                onClick={onConfigureTask}
                //className="text-foreground/60 hover:text-foreground/90 transition-colors p-2 hover:bg-[#2c2c2e] rounded-xl"
                tooltipContent="Add Task"
              >
                <Plus />
              </IconButtonWithTooltip>
              <IconButtonWithTooltip
                onClick={onConfigureAgent}
                // className="text-white/60 hover:text-white/90 transition-colors p-2 hover:bg-[#2c2c2e] rounded-xl"
                tooltipContent="Configure Agent"
              >
                <Settings />
              </IconButtonWithTooltip>
              <IconButtonWithTooltip
                onClick={onClose}
                //className="text-white/60 hover:text-white/90 transition-colors p-2 hover:bg-[#2c2c2e] rounded-xl"
                tooltipContent="Close"
              >
                <X />
              </IconButtonWithTooltip>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'incoming' ? 'flex-row' : 'flex-row-reverse'
                    }`}
                >
                  {message.type === 'incoming' && (
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-8 h-8 rounded-xl"
                    />
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] ${message.type === 'incoming'
                      ? 'bg-secondary text-secondary-foreground/90'
                      : 'bg-primary text-primary-foreground ml-auto'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t sticky bottom-0">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Type your message..."
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && onMessageSend()}
              />
            </div>
            <IconButton
              onClick={onToggleVoice}
              className={`p-2 rounded-xl transition-colors ${isListening
                && 'bg-red-500 text-white'
                }`}
            >
              {isListening ? <MicOff /> : <Mic />}
            </IconButton>
            <TextButton
              onClick={onMessageSend}
            //className="bg-blue-500 text-white rounded-xl px-6 hover:bg-blue-600 transition-colors"
            >
              Send
            </TextButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}