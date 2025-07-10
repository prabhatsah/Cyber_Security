import React, { useEffect, useState, useRef } from 'react';
import { Bell, Volume2, X, Check, BellOff } from 'lucide-react';
import type { PersonalAssistant, Agent } from '../types/agent';

interface NotificationSystemProps {
  personalAssistant: PersonalAssistant | null;
  agents: Agent[];
}

interface Notification {
  id: string;
  agentId: string;
  event: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  acknowledged: boolean;
}

export function NotificationSystem({ personalAssistant, agents }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mutedEvents, setMutedEvents] = useState<Set<string>>(new Set());
  const recentNotifications = useRef<Set<string>>(new Set());
  const notificationTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const acknowledgedNotifications = useRef<Set<string>>(new Set());

  // Simulated speech synthesis
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = speechSynthesis.getVoices().find(v => 
        v.name.toLowerCase().includes(personalAssistant?.voice.name.toLowerCase() || '')
      );
      if (voice) utterance.voice = voice;
      speechSynthesis.speak(utterance);
    }
  };

  const isDuplicateNotification = (message: string, event: string, agentId: string): boolean => {
    const key = `${agentId}:${event}:${message}`;
    return recentNotifications.current.has(key) || acknowledgedNotifications.current.has(key);
  };

  const addNotificationWithTimeout = (key: string, timeout: number = 60000) => {
    recentNotifications.current.add(key);
    
    // Clear existing timeout if any
    if (notificationTimeouts.current.has(key)) {
      clearTimeout(notificationTimeouts.current.get(key)!);
    }
    
    // Set new timeout
    const timeoutId = setTimeout(() => {
      recentNotifications.current.delete(key);
      notificationTimeouts.current.delete(key);
    }, timeout);
    
    notificationTimeouts.current.set(key, timeoutId);
  };

  const handleAcknowledge = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      const key = `${notification.agentId}:${notification.event}:${notification.message}`;
      acknowledgedNotifications.current.add(key);
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, acknowledged: true, read: true } : n
      ));
    }
  };

  const handleMuteEvent = (event: string) => {
    setMutedEvents(prev => {
      const newMuted = new Set(prev);
      newMuted.add(event);
      return newMuted;
    });
  };

  const handleUnmuteEvent = (event: string) => {
    setMutedEvents(prev => {
      const newMuted = new Set(prev);
      newMuted.delete(event);
      return newMuted;
    });

    // Clear acknowledged notifications for this event type
    const eventPattern = new RegExp(`.*:${event}:.*`);
    Array.from(acknowledgedNotifications.current).forEach(key => {
      if (eventPattern.test(key)) {
        acknowledgedNotifications.current.delete(key);
      }
    });
  };

  // Example of an AI agent detecting an anomaly and informing the personal assistant
  const simulateAgentEvent = () => {
    const agent = agents[0]; // Using the first agent for this example
    const event = 'data.anomaly';
    const message = `Unusual pattern detected in financial data: 25% spike in transaction volume`;

    // Skip if event type is muted
    if (mutedEvents.has(event)) {
      return;
    }

    // Check if the personal assistant is configured to receive this notification
    const preference = personalAssistant?.notificationPreferences.find(p => p.agentId === agent.id);
    
    if (preference && preference.events.includes(event)) {
      const notificationKey = `${agent.id}:${event}:${message}`;
      
      // Check for duplicate or acknowledged notification
      if (isDuplicateNotification(message, event, agent.id)) {
        return; // Skip duplicate or acknowledged notification
      }

      const notification: Notification = {
        id: crypto.randomUUID(),
        agentId: agent.id,
        event,
        message,
        timestamp: new Date(),
        priority: preference.priority,
        read: false,
        acknowledged: false
      };

      setNotifications(prev => [notification, ...prev]);
      addNotificationWithTimeout(notificationKey);

      // Voice notification if enabled
      if (preference.notifyVia.includes('voice')) {
        const voiceMessage = `${personalAssistant?.name} here. ${agent.name} reports: ${message}`;
        speak(voiceMessage);
      }
    }
  };

  useEffect(() => {
    // Simulate an agent event every 10 seconds
    const interval = setInterval(simulateAgentEvent, 10000);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
      // Clear all notification timeouts
      notificationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      notificationTimeouts.current.clear();
      recentNotifications.current.clear();
      acknowledgedNotifications.current.clear();
    };
  }, [personalAssistant, agents, mutedEvents]);

  // Filter out acknowledged notifications after a certain time
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setNotifications(prev => prev.filter(n => !n.acknowledged));
    }, 5000); // Clean up every 5 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <>
      {/* Notification Trigger */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-xl bg-[#2c2c2e] text-white/90 hover:bg-[#3c3c3e] transition-colors"
        >
          <Bell className="w-6 h-6" />
          {notifications.some(n => !n.read) && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#1c1c1e] border-l border-[#2c2c2e] p-6 shadow-xl z-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white/90">Notifications</h2>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Muted Events Section */}
          {mutedEvents.size > 0 && (
            <div className="mb-4 p-4 bg-[#2c2c2e] rounded-xl">
              <h3 className="text-sm font-medium text-white/90 mb-2">Muted Events</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(mutedEvents).map(event => (
                  <button
                    key={event}
                    onClick={() => handleUnmuteEvent(event)}
                    className="flex items-center gap-1 text-xs bg-[#3c3c3e] text-white/60 px-2 py-1 rounded-lg hover:bg-[#4c4c4e]"
                  >
                    <span>{event.split('.').join(' ')}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-white/60 text-center">No notifications yet</p>
            ) : (
              notifications
                .filter(n => !n.acknowledged) // Only show unacknowledged notifications
                .map(notification => {
                  const agent = agents.find(a => a.id === notification.agentId);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border ${
                        notification.read
                          ? 'bg-[#2c2c2e] border-[#3c3c3e]'
                          : 'bg-blue-500/10 border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={agent?.avatar}
                          alt={agent?.name}
                          className="w-10 h-10 rounded-xl"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white/90">{agent?.name}</h4>
                            <span className="text-xs text-white/60">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-white/80 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-lg ${
                              notification.priority === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : notification.priority === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {notification.priority}
                            </span>
                            <span className="text-xs text-white/60">
                              {notification.event.split('.').join(' ')}
                            </span>
                            <div className="flex items-center gap-2 ml-auto">
                              <button
                                onClick={() => handleAcknowledge(notification.id)}
                                className="p-1 rounded-lg hover:bg-[#3c3c3e] text-white/60 hover:text-white/90"
                                title="Acknowledge"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMuteEvent(notification.event)}
                                className="p-1 rounded-lg hover:bg-[#3c3c3e] text-white/60 hover:text-white/90"
                                title="Mute this event type"
                              >
                                <BellOff className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}
    </>
  );
}