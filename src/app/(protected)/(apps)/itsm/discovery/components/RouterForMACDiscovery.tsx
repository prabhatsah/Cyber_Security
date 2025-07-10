'use client';

import { useState } from 'react';
import { IconTextButton } from '@/ikon/components/buttons';

import { Card } from '@/shadcn/ui/card';
import { Trash2 } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl } from '@/shadcn/ui/form';
import FormInput from '@/ikon/components/form-fields/input';

interface FormSection {
    id: string;
    snmpPort: string;
    snmpVersion: string;
    communityString: string;
    routerIp: string;
}

export default function MACdiscovery() {
    const [sections, setSections] = useState<FormSection[]>([]);

    const addSection = () => {
        const newSection: FormSection = {
            id: Math.random().toString(36).substring(7),
            snmpPort: '',
            snmpVersion: '',
            communityString: '',
            routerIp: '',
        };
        setSections([...sections, newSection]);
    };

    const deleteSection = (id: string) => {
        setSections(sections.filter(section => section.id !== id));
    };

    const updateSection = (id: string, field: keyof FormSection, value: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, [field]: value } : section
        ));
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                

                {sections.map((section) => (
                    <Card key={section.id} className="p-6 relative mb-6">
                        <IconTextButton
                            variant="destructive"
                            size="icon"
                            className="absolute top-4 right-4"
                            onClick={() => deleteSection(section.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </IconTextButton>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                name={`routerIp-${section.id}`}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Router IP for MAC Address Mapping</FormLabel>
                                        <FormControl>
                                            <FormInput
                                                value={section.routerIp}
                                                onChange={(e) => updateSection(section.id, 'routerIp', e.target.value)}
                                                placeholder="Enter Router IP" name={''} formControl={undefined} />                                           />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`snmpPort-${section.id}`}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>SNMP Port</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={section.snmpPort}
                                                onChange={(e) => updateSection(section.id, 'snmpPort', e.target.value)}
                                                placeholder="ex.25"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`snmpVersion-${section.id}`}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>SNMP Version</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={section.snmpVersion}
                                                onChange={(e) => updateSection(section.id, 'snmpVersion', e.target.value)}
                                                placeholder="SNMP V1"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`communityString-${section.id}`}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Community String</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                value={section.communityString}
                                                onChange={(e) => updateSection(section.id, 'communityString', e.target.value)}
                                                placeholder="••••••••••"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>
                ))}

                {sections.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No sections added. Click &quot;Add New Section&quot; to begin.
                    </div>
                )}
            </div>
        </div>
    );
}