import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion';
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import React, { useState } from 'react';
import FrameworkForm from './frameworkForm';

export type Field = {
    name: string;
    type: string;
    extraInfo?: Array<{ label: string; value: string }>;
};

export default function FieldConfigurationForm({
    fieldSelectionModal,
    setFieldSelectionModal
}: {
    fieldSelectionModal: boolean;
    setFieldSelectionModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('text');
    const [newFieldDropdownOptions, setNewFieldDropdownOptions] = useState('');
    const [identifier, setIdentifier] = useState<string | null>(null);
    const [openFrameworkForm, setOpenFrameworkForm] = useState<boolean>(false);

    const [field, setField] = useState<Field[]>([]);
    function addField() {
        if (!newFieldName.trim()) {
            return;
        }

        let options: string[] = [];
        if (newFieldType === 'dropdown') {
            options = newFieldDropdownOptions.split(',').map(option => option.trim()).filter(option => option !== '');
            if (options.length === 0) {
                return;
            }
        }
        const dropdownOptions = options.map((option) => {
            return {
                value: crypto.randomUUID(),
                label: option
            }
        })
        console.log(dropdownOptions);
        const newField = {
            name: newFieldName,
            type: newFieldType,
            ...(newFieldType === 'dropdown' && { extraInfo: dropdownOptions })
        }

        setField(prev => [...prev, newField]);
        setNewFieldName('');
        setNewFieldType('text');
        setNewFieldDropdownOptions('')
    }
    console.log(field);
    return (
        <>
            <Dialog open={fieldSelectionModal} onOpenChange={setFieldSelectionModal}>
                <DialogContent className="max-w-[60%] max-h-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Field Configuration</DialogTitle>
                    </DialogHeader>

                    <div className="mb-8 p-4 border border-border rounded-md bg-secondary/10">
                        <h2 className="text-xl font-semibold mb-4 text-primary-foreground">Add New Field</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            {/* Field Name Input */}
                            <div className="col-span-1 md:col-span-1">
                                <Label htmlFor="newFieldName" className="block text-sm font-medium mb-1">
                                    Field Name
                                </Label>
                                <input
                                    id="newFieldName"
                                    type="text"
                                    placeholder="e.g., Username"
                                    value={newFieldName}
                                    onChange={(e) => setNewFieldName(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            {/* Field Type Select */}
                            <div className="col-span-1 md:col-span-1">
                                <Label htmlFor="newFieldType" className="block text-sm font-medium mb-1">
                                    Field Type
                                </Label>
                                <select
                                    id="newFieldType"
                                    value={newFieldType}
                                    onChange={(e) => setNewFieldType(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="text">Text</option>
                                    <option value="email">Email</option>
                                    <option value="number">Number</option>
                                    <option value="password">Password</option>
                                    <option value="date">Date</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="dropdown">Dropdown</option>
                                </select>
                            </div>
                            {/* Add Field Button */}
                            <div className="col-span-1 md:col-span-1">
                                <button
                                    onClick={addField}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                                >
                                    Add Field
                                </button>
                            </div>
                        </div>
                        {/* Conditional input for Dropdown options when adding a new field */}
                        {newFieldType === 'dropdown' && (
                            <div className="mt-4">
                                <label htmlFor="dropdownOptions" className="block text-sm font-medium mb-1">
                                    Dropdown Options (comma-separated)
                                </label>
                                <input
                                    id="dropdownOptions"
                                    type="text"
                                    placeholder="e.g., Option 1, Option 2, Option 3"
                                    value={newFieldDropdownOptions}
                                    onChange={(e) => setNewFieldDropdownOptions(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        )}
                    </div>

                    <div className="pr-2">
                        <Accordion type="multiple" className="w-full mt-4">
                            {field.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between w-full items-center">
                                            <div className="flex items-center gap-2">
                                                {/* Radio button for identifier */}
                                                <Input
                                                    type="radio"
                                                    name="identifier"
                                                    checked={identifier === item.name}
                                                    onChange={() => setIdentifier(item.name)}
                                                    className="accent-primary"
                                                />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-muted-foreground text-sm">{item.type}</span>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        {item.type === "dropdown" && item.extraInfo && item.extraInfo.length > 0 ? (
                                            <ul className="list-disc list-inside space-y-1">
                                                {item.extraInfo.map((opt: any) => (
                                                    <li key={opt.value}>
                                                        <span className="font-medium">{opt.label}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                                No extra information available.
                                            </p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>


                    <DialogFooter>
                        <Button type="submit" onClick={()=>{setOpenFrameworkForm(true) }}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
            {
                openFrameworkForm && (
                    <FrameworkForm openFrameworkForm={openFrameworkForm} setOpenFrameworkForm={setOpenFrameworkForm} setFieldSelectionModal={setFieldSelectionModal} fields={field} />
                )
            }
        </>
    )
}
