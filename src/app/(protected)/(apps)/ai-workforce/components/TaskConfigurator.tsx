import React, { useState } from 'react';
import { Plus, X, Clock, Zap, Calendar } from 'lucide-react';
import type { Task, TaskStep } from '../types/agent';

interface TaskConfiguratorProps {
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export function TaskConfigurator({ onSave, onCancel }: TaskConfiguratorProps) {
  const [task, setTask] = useState<Partial<Task>>({
    name: '',
    description: '',
    type: 'on-demand',
    steps: [],
    status: 'idle'
  });

  const [currentStep, setCurrentStep] = useState<Partial<TaskStep>>({
    name: '',
    description: '',
    action: '',
    parameters: {},
    order: 0
  });

  const addStep = () => {
    if (!currentStep.name || !currentStep.action) return;

    const newStep: TaskStep = {
      id: Date.now().toString(),
      name: currentStep.name,
      description: currentStep.description || '',
      action: currentStep.action,
      parameters: currentStep.parameters || {},
      order: task.steps?.length || 0,
      status: 'pending'
    };

    setTask(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));

    setCurrentStep({
      name: '',
      description: '',
      action: '',
      parameters: {},
      order: (task.steps?.length || 0) + 1
    });
  };

  const handleSave = () => {
    if (!task.name || !task.type || !task.steps?.length) return;

    onSave({
      id: Date.now().toString(),
      name: task.name,
      description: task.description || '',
      type: task.type as Task['type'],
      steps: task.steps as TaskStep[],
      status: 'idle',
      schedule: task.schedule,
      trigger: task.trigger
    });
  };

  return (
    <div className="bg-[#1c1c1e] rounded-3xl border border-[#2c2c2e] p-6 w-[500px] max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white/90">Configure Task</h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Task Name</label>
          <input
            type="text"
            value={task.name}
            onChange={e => setTask(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter task name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
          <textarea
            value={task.description}
            onChange={e => setTask(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Describe the task"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Task Type</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTask(prev => ({ ...prev, type: 'on-demand' }))}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                task.type === 'on-demand'
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>On Demand</span>
            </button>
            <button
              onClick={() => setTask(prev => ({ ...prev, type: 'scheduled' }))}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                task.type === 'scheduled'
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Scheduled</span>
            </button>
            <button
              onClick={() => setTask(prev => ({ ...prev, type: 'event-triggered' }))}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                task.type === 'event-triggered'
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'border-[#3c3c3e] text-white/60 hover:text-white/90'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Event</span>
            </button>
          </div>
        </div>

        {task.type === 'scheduled' && (
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Schedule (Cron)</label>
            <input
              type="text"
              value={task.schedule}
              onChange={e => setTask(prev => ({ ...prev, schedule: e.target.value }))}
              className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              placeholder="*/5 * * * *"
            />
          </div>
        )}

        {task.type === 'event-triggered' && (
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Event Trigger</label>
            <input
              type="text"
              value={task.trigger}
              onChange={e => setTask(prev => ({ ...prev, trigger: e.target.value }))}
              className="w-full bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              placeholder="user.login, data.update, etc."
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-white/60">Task Steps</label>
            <button
              onClick={addStep}
              className="p-2 rounded-xl bg-[#2c2c2e] text-white/60 hover:text-white/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={currentStep.name}
                onChange={e => setCurrentStep(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Step name"
              />
              <input
                type="text"
                value={currentStep.action}
                onChange={e => setCurrentStep(prev => ({ ...prev, action: e.target.value }))}
                className="bg-[#2c2c2e] rounded-xl px-4 py-2 text-white/90 border border-[#3c3c3e] focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Action"
              />
            </div>

            <div className="space-y-2">
              {task.steps?.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-3 bg-[#2c2c2e] rounded-xl"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-[#3c3c3e] rounded-lg text-sm text-white/90">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium text-white/90">{step.name}</h4>
                    <p className="text-sm text-white/60">{step.action}</p>
                  </div>
                  <button
                    onClick={() => setTask(prev => ({
                      ...prev,
                      steps: prev.steps?.filter(s => s.id !== step.id)
                    }))}
                    className="p-2 rounded-lg hover:bg-[#3c3c3e] text-white/60 hover:text-white/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white rounded-xl py-3 hover:bg-blue-600 transition-colors"
          >
            Save Task
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-[#2c2c2e] text-white/90 rounded-xl py-3 hover:bg-[#3c3c3e] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}