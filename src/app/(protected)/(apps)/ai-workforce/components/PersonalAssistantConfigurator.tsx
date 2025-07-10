import React, { useState, useEffect } from 'react';
import { X, Volume2, Bell, Check } from 'lucide-react';
import type { PersonalAssistant, Voice, NotificationPreference, Agent } from '../types/agent';
import { MALE_AVATARS, FEMALE_AVATARS } from '../constants/avatars';
import {
  IconButton,
  IconTextButton,
  TextButton,
} from "@/ikon/components/buttons";
import { Input } from "@/shadcn/ui/input";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Label } from '@/shadcn/ui/label';
import { mapProcessNameProps } from '@/ikon/utils/api/processRuntimeService/type';
import { string } from 'zod';

interface PersonalAssistantConfiguratorProps {
  agents: Agent[];
  existingAssistant?: PersonalAssistant | null;
  onSave: (assistant: PersonalAssistant) => void;
  open: boolean;
  onClose: () => void;
}

const VOICE_OPTIONS: Voice[] = [
  { id: 'en-us-male-1', name: 'James', gender: 'male', language: 'en-US', accent: 'General American' },
  { id: 'en-us-male-2', name: 'Michael', gender: 'male', language: 'en-US', accent: 'General American' },
  { id: 'en-gb-male-1', name: 'William', gender: 'male', language: 'en-GB', accent: 'Received Pronunciation' },
  { id: 'en-us-female-1', name: 'Emma', gender: 'female', language: 'en-US', accent: 'General American' },
  { id: 'en-us-female-2', name: 'Sophia', gender: 'female', language: 'en-US', accent: 'General American' },
  { id: 'en-gb-female-1', name: 'Charlotte', gender: 'female', language: 'en-GB', accent: 'Received Pronunciation' },
];


type InstanceData = {
  EVENT_TYPES?: string[];  // Optional in case it's missing
};

type InstanceResponse = {
  data: {
    name: string;
    avatar: string;
    voice: string;
    gender: string;
    preferences: NotificationPreference[];
    EVENT_TYPES?: string[];
  };
  taskId: string;
  taskName: string;
  processInstanceId: string;
  processInstanceAccountId: string;
  sender: string;
  message: string;
  action: string;
  lockedByMe: boolean;
  suspended: boolean;
  timestamp: string;
}[];




export function PersonalAssistantConfigurator({
  agents,
  existingAssistant,
  onSave,
  open,
  onClose
}: PersonalAssistantConfiguratorProps) {


  const [step, setStep] = useState(1);
  const [assistant, setAssistant] = useState<Partial<PersonalAssistant>>({
    id: existingAssistant?.id || crypto.randomUUID(),
    name: existingAssistant?.name || '',
    gender: existingAssistant?.gender || 'male',
    avatar: existingAssistant?.avatar || '',
    voice: existingAssistant?.voice || undefined,
    notificationPreferences: existingAssistant?.notificationPreferences || [],
  });
  const [selectedAvatar, setSelectedAvatar] = useState(existingAssistant?.avatar || '');
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(existingAssistant?.voice || null);
  const [preferences, setPreferences] = useState<NotificationPreference[]>(
    existingAssistant?.notificationPreferences || []
  );

  const [eventTypes, setEventTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchEventTypes = async () => {
      try {
        const instances: InstanceResponse = await getMyInstancesV2({
          processName: "Configuration form event checkbox list",
          predefinedFilters: { taskName: "event checkbox list" },
        });
    
        console.log("API Response:", instances);
    
        // Ensure EVENT_TYPES is always an array
        const eventTypes = instances.length > 0 && instances[0]?.data?.EVENT_TYPES
          ? instances[0].data.EVENT_TYPES
          : [];
    
        setEventTypes(eventTypes);
      } catch (error) {
        console.error("Error fetching event types:", error);
      }
    };    

    fetchEventTypes();
  }, [open]);
  
  // Ensure step is set correctly when editing an assistant
  useEffect(() => {
    if (existingAssistant) {
      setStep(2); // Skip to notification preferences if editing
    }
  }, [existingAssistant]);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setAssistant(prev => ({ ...prev, gender }));
    setSelectedAvatar('');
    setSelectedVoice(null);
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setAssistant(prev => ({ ...prev, avatar }));
  };

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice);
    setAssistant(prev => ({ ...prev, voice }));
  };

  const handlePreferenceChange = (agentId: string, field: keyof NotificationPreference, value: any) => {
    setPreferences(prev => {
      const existing = prev.find(p => p.agentId === agentId);
      if (existing) {
        return prev.map(p => 
          p.agentId === agentId ? { ...p, [field]: value } : p
        );
      }
      return [...prev, {
        agentId,
        events: [],
        priority: 'medium',
        notifyVia: ['message'],
        [field]: value,
      } as NotificationPreference];
    });
  };

  const handleSave = async () => {
    if (!assistant.name || !assistant.avatar || !assistant.voice) return;

    try{
      
      
      const instancesCheck : InstanceResponse = await getMyInstancesV2({processName: "Configure Personal Assistant",predefinedFilters: {taskName: "Personal Assistant Data"}}); 

      console.log(instancesCheck);

      let mergedData = {
        name: assistant.name,
        avatar: assistant.avatar,
        voice: assistant.voice.name,
        gender: assistant.gender,
        preferences: preferences,
      };

      if(instancesCheck && instancesCheck.length > 0){
        console.log("invoke trasition");
        const taskId : string = instancesCheck[0].taskId;
        const existingData = instancesCheck[0].data;

        mergedData = {
          ...existingData,
          ...mergedData, // form values overwrite existing API values
        }

        const invokeTask= await invokeAction({
          taskId,
          transitionName: "Save",
          data: mergedData,
          processInstanceIdentifierField: ""
        });

      }else{
        const processMap : string = await mapProcessName({processName: "Configure Personal Assistant"});
        console.log(processMap);
        const processId = processMap;
        const processIdentifierFields: string | null = null; 

        const processResponse = await startProcessV2({
          processId,
          data: mergedData,
          processIdentifierFields
        });
      }

      onSave({
        ...assistant as Required<Omit<PersonalAssistant, 'notificationPreferences'>>,
        notificationPreferences: preferences,
      });
  
      onClose();

    }catch(error){
      console.log("Error fetching data: "+error);
    }
  };


  return (

    <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="md:max-w-[60%] md:max-h-[90vh] sm:max-w-[445px] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle >{existingAssistant ? 'Edit Personal Assistant' : 'Configure Personal Assistant'}</DialogTitle>
        </DialogHeader>
        { <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label>Assistant Name</Label>
                <Input
                  type="text"
                  value={assistant.name || ""}
                  onChange={(e) =>
                    setAssistant((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder='Enter name'
                />
            </div>

            <div>
              <Label>Gender</Label>
              <div className="flex gap-3">
                  {(["male", "female"] as const).map((gender) => {
                    const isSelected = assistant.gender === gender;

                    return (
                      <TextButton
                        key={gender}
                        onClick={() => handleGenderSelect(gender)}
                        variant={isSelected ? "default" : "outline"} // Use "outline" when not selected
                        className="flex-1 h-auto p-4 rounded-xl flex items-center justify-center gap-2 transition-colors border-primary"
                      >
                        {gender}
                      </TextButton>
                    );
                  })}
                </div>
             </div>

            {assistant.gender && (
              <div>
                <Label>Select Avatar</Label>
                <div className="grid grid-cols-5 gap-4">
                  {(assistant.gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS).map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedAvatar === avatar
                          ? 'hover:border-primary'
                          : ' hover:border-primary'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      {selectedAvatar === avatar && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

              {selectedAvatar && (
                <div>
                  <Label> Select Voice</Label>
                  <div className="space-y-3">
                    {VOICE_OPTIONS.filter(voice => voice.gender === assistant.gender).map(voice => (
                      <TextButton
                        key={voice.id}
                        onClick={() => handleVoiceSelect(voice)}
                        variant={selectedVoice?.id === voice.id ? "default" : "outline"}
                        className={`w-full h-auto p-5 rounded-xl flex items-center justify-between transition-colors ${
                          selectedVoice?.id === voice.id
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-primary hover:border-primary'
                        }`}
                      >
                        <div>
                          <h4 className="font-medium">{voice.name}</h4>
                          <p className="text-sm opacity-80">{voice.accent}</p>
                        </div>
                        <Volume2 className="w-5 h-5" />
                      </TextButton>
                    ))}
                  </div>
                </div>
              )}


            {selectedVoice && (
              <div className="flex justify-end">
                <TextButton
                  onClick={() => setStep(2)}
                  className=" text-white rounded-xl px-6 py-2  transition-colors"
                >
                  Next: Configure Notifications
                </TextButton>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.id} className=" rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-xl" />
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm">{agent.role}</p>
                      </div>
                    </div>
                    <div>
                      <Label> Events to Monitor</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {eventTypes.length > 0 ? (
                          eventTypes.map(event => (
                            <Label key={event} className="flex items-center gap-2"> 
                              <input
                                type="checkbox"
                                checked={preferences.find(p => p.agentId === agent.id)?.events.includes(event) || false}
                                onChange={e => {
                                  const current = preferences.find(p => p.agentId === agent.id)?.events || [];
                                  handlePreferenceChange(
                                    agent.id,
                                    'events',
                                    e.target.checked
                                      ? [...current, event]
                                      : current.filter(e => e !== event)
                                  );
                                }}
                                className="rounded border-primary bg-primary text-secondary focus:accent"
                              />
                              <span >{event.split('.').join(' ')}</span>
                            </Label>
                          ))
                        ) : (
                          <p className="text-white/60">No events available.</p> // Fallback when no events are present
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <div className="flex gap-3">
                        {['low', 'medium', 'high'].map(priority => {
                          const isSelected = preferences.find(p => p.agentId === agent.id)?.priority === priority;

                          return (
                            <TextButton
                              key={priority}
                              onClick={() => handlePreferenceChange(agent.id, 'priority', priority)}
                              variant={isSelected ? "default" : "outline"} // Uses "outline" when unselected
                              className="flex-1 p-2 rounded-xl capitalize transition-colors border-primary"
                            >
                              {priority}
                            </TextButton>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <Label> Notification Method</Label>
                      <div className="flex gap-3">
                          {[
                            { id: 'voice', icon: <Volume2 className="w-4 h-4" /> },
                            { id: 'message', icon: <Bell className="w-4 h-4" /> },
                          ].map(method => {
                            const isSelected = preferences.find(p => p.agentId === agent.id)?.notifyVia?.includes(method.id as any);

                            return (
                              <TextButton
                                key={method.id}
                                onClick={() => {
                                  const current = preferences.find(p => p.agentId === agent.id)?.notifyVia || [];
                                  handlePreferenceChange(
                                    agent.id,
                                    'notifyVia',
                                    isSelected
                                      ? current.filter(m => m !== method.id)
                                      : [...current, method.id]
                                  );
                                }}
                                variant={isSelected ? "default" : "outline"} // Use "outline" when not selected
                                className="flex-1 p-2 rounded-xl flex items-center justify-center gap-2 capitalize transition-colors border-primary"
                              >
                                {method.icon}
                                {method.id}
                              </TextButton>
                            );
                          })}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <TextButton
                onClick={() => setStep(1)}
                className="rounded-xl px-6 py-2 hover:accent border-primary"
                variant={"outline"}
              >
                Back
              </TextButton>
              <TextButton
                onClick={handleSave}
                className=" rounded-xl px-6 py-2 hover:accent border-primary"
              >
                {existingAssistant ? 'Save Changes' : 'Create Personal Assistant'}
              </TextButton>
            </div>
          </div>
        )}
      </div>
}
       
    </DialogContent>
    </Dialog>
  );
}