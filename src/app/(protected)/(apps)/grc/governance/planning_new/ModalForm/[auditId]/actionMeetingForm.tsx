"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
    CheckCircle,
    AlertTriangle,
    Loader2,
    XCircle,
    User,
    Calendar,
    Clock,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from "@/shadcn/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Calendar as CalendarUI } from "@/shadcn/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover"
import { format } from "date-fns"

interface FormValues {
    actions: {
        description: string;
        assignedTo: string;
        dueDate: Date | undefined;
        timeEntries: { date: Date; hours: number }[];
    }[];
    observations: string[];
    recommendations: string[];
    controlPolicy: string;
    controlObjective: string;
}

const users = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'Bob Johnson' },
    { id: 'user4', name: 'Alice Brown' },
];

const ActionMeetingForm = () => {
    
    const [actions, setActions] = useState<{ description: string; assignedTo: string; dueDate: Date | undefined; timeEntries: { date: Date; hours: number }[]; }[]>([]);
    const [initialValues, setInitialValues] = useState<FormValues>({
        observations: [],
        recommendations: [],
        controlPolicy: '',
        controlObjective: '',
        actions: [],
    });
    const [newActionInput, setNewActionInput] = useState('');
    const [date, setDate] = useState<Date>()
    const [expandedActionIndex, setExpandedActionIndex] = useState<number | null>(null); // Track expanded action

    // Simulate fetching initial values
    useEffect(() => {
        // In a real application, you would fetch these from an API.
        const fetchedValues = {
            observations: [
                "Observation 1: Control implementation is partially complete.",
                "Observation 2: Some users lack necessary training.",
            ],
            recommendations: [
                "Recommendation 1: Complete control implementation.",
                "Recommendation 2: Provide training to affected users.",
                "Recommendation 3: Review access controls.",
            ],
            controlPolicy: "CP-001: Access Control Policy",
            controlObjective: "CO-001.01: User Access Rights",
            actions: []
        };
        setInitialValues(fetchedValues);
    }, []);

    const handleAddAction = (newAction: string) => {
        if (newAction.trim()) {
            setActions(prevActions => [...prevActions, { description: newAction.trim(), assignedTo: '', dueDate: undefined, timeEntries: [] }]);
            setNewActionInput('');
        }
    };

    const handleRemoveAction = (index: number) => {
        setActions(prevActions => prevActions.filter((_, i) => i !== index));
        if (expandedActionIndex === index) {
            setExpandedActionIndex(null); // Collapse if the expanded action is removed
        }
    };

    const handleActionChange = (index: number, field: keyof { description: string; assignedTo: string; dueDate: Date | undefined; timeEntries: { date: Date; hours: number }[]; }, value: any) => {
        const updatedActions = [...actions];
        updatedActions[index] = { ...updatedActions[index], [field]: value };
        setActions(updatedActions);
    };

    const handleAddTimeEntry = (actionIndex: number) => {
        const updatedActions = [...actions];
        updatedActions[actionIndex].timeEntries = [...updatedActions[actionIndex].timeEntries, { date: new Date(), hours: 0 }];
        setActions(updatedActions);
    };

    const handleTimeEntryChange = (actionIndex: number, timeEntryIndex: number, field: keyof { date: Date; hours: number }, value: any) => {
        const updatedActions = [...actions];
        updatedActions[actionIndex].timeEntries[timeEntryIndex] = {
            ...updatedActions[actionIndex].timeEntries[timeEntryIndex],
            [field]: value,
        };
        setActions(updatedActions);
    };

    const handleRemoveTimeEntry = (actionIndex: number, timeEntryIndex: number) => {
        const updatedActions = [...actions];
        updatedActions[actionIndex].timeEntries = updatedActions[actionIndex].timeEntries.filter((_, i) => i !== timeEntryIndex);
        setActions(updatedActions);
    };

    const handleSubmit = async () => {
        console.log(initialValues)
    };



    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {initialValues.controlPolicy && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Control Policy
                        </label>
                        <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                            {initialValues.controlPolicy}
                        </div>
                    </div>
                )}

                {initialValues.controlObjective && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Control Objective
                        </label>
                        <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                            {initialValues.controlObjective}
                        </div>
                    </div>
                )}

                {initialValues.observations && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Observations
                        </label>
                        <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                            {initialValues.observations.map((observation, index) => (
                                <li key={index}>{observation}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {initialValues.recommendations && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Recommendations
                        </label>
                        <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                            {initialValues.recommendations.map((recommendation, index) => (
                                <li key={index}>{recommendation}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300">
                        Actions to be Taken <span className="text-red-500">*</span>
                    </label>
                    <div className='max-h-[35vh] overflow-y-auto pr-2'>
                        {actions.map((action, index) => (
                            <div key={index} className="space-y-4 mb-4 p-4 rounded-md bg-gray-800 border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1'>
                                        {expandedActionIndex === index ? (
                                            <Textarea
                                                value={action.description}
                                                onChange={(e) => handleActionChange(index, 'description', e.target.value)}
                                                placeholder="Describe the action..."
                                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400
                                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500  min-h-[60px] resize-none flex-1"
                                                required
                                            />
                                        ) : (
                                            <div className="text-gray-300 p-2 rounded-md flex-1 break-words">
                                                {action.description}
                                                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1'>
                                                    {action.assignedTo && (
                                                        <span className="text-gray-400 text-sm">
                                                            Assigned To: {users.find(u => u.id === action.assignedTo)?.name || 'N/A'}
                                                        </span>
                                                    )}
                                                    {action.dueDate && (
                                                        <span className="text-gray-400 text-sm">
                                                            Due Date: {format(action.dueDate, "PPP")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <div className='flex gap-2'>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setExpandedActionIndex(prevIndex => prevIndex === index ? null : index)}
                                            className="text-gray-400 hover:text-gray-300"
                                        >
                                            {expandedActionIndex === index ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                            <span className="sr-only">
                                                {expandedActionIndex === index ? 'Collapse action' : 'Expand action'}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveAction(index)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span className="sr-only">Remove action</span>
                                        </Button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedActionIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-300">Assigned To</label>
                                                    <Select
                                                        value={action.assignedTo}
                                                        onValueChange={(value) => handleActionChange(index, 'assignedTo', value)}
                                                    >
                                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-300">
                                                            <SelectValue placeholder="Select user" />
                                                            <User className="w-4 h-4 ml-auto text-gray-400" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-gray-800 border-gray-700">
                                                            {users.map(user => (
                                                                <SelectItem key={user.id} value={user.id} className="hover:bg-gray-700/50 text-gray-200">
                                                                    {user.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-300">Due Date</label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full bg-gray-700 border-gray-600 text-gray-300 justify-start text-left font-normal",
                                                                    !date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {action.dueDate ? (
                                                                    format(action.dueDate, "PPP")
                                                                ) : (
                                                                    <span className="text-gray-400">Pick a date</span>
                                                                )}
                                                                <Calendar className="w-4 h-4 ml-auto opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                                                            <CalendarUI
                                                                mode="single"
                                                                selected={action.dueDate}
                                                                onSelect={(date) => handleActionChange(index, 'dueDate', date)}
                                                                className="rounded-md border border-gray-700 text-gray-200"
                                                                style={{ backgroundColor: '#374151' }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">Time Spent</label>
                                                {action.timeEntries.map((timeEntry, timeEntryIndex) => (
                                                    <div key={timeEntryIndex} className="flex items-center gap-2 mb-2">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "bg-gray-700 border-gray-600 text-gray-300 justify-start text-left font-normal flex-1",
                                                                        !timeEntry.date && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {timeEntry.date ? (
                                                                        format(timeEntry.date, "PPP")
                                                                    ) : (
                                                                        <span className="text-gray-400">Pick a date</span>
                                                                    )}
                                                                    <Calendar className="w-4 h-4 ml-2 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                                                                <CalendarUI
                                                                    mode="single"
                                                                    selected={timeEntry.date}
                                                                    onSelect={(date) =>
                                                                        handleTimeEntryChange(index, timeEntryIndex, 'date', date)
                                                                    }
                                                                    className="rounded-md border border-gray-700 text-gray-200"
                                                                    style={{ backgroundColor: '#374151' }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Input
                                                            type="number"
                                                            value={timeEntry.hours}
                                                            onChange={(e) =>
                                                                handleTimeEntryChange(index, timeEntryIndex, 'hours', Number(e.target.value))
                                                            }
                                                            placeholder="Hours"
                                                            className="bg-gray-700 border-gray-600 text-gray-300 placeholder:text-gray-400 w-24
                                                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            min="0"
                                                            required
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveTimeEntry(index, timeEntryIndex)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            <span className="sr-only">Remove time entry</span>
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleAddTimeEntry(index)}
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                                                >
                                                    Add Time Entry
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                        <div className="flex items-center gap-2">
                            <Input
                                value={newActionInput}
                                onChange={(e) => setNewActionInput(e.target.value)}
                                placeholder="Add a new action..."
                                className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                            />
                            <Button
                                variant="outline"
                                onClick={() => handleAddAction(newActionInput)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                                disabled={!newActionInput.trim()}
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ActionMeetingForm;

