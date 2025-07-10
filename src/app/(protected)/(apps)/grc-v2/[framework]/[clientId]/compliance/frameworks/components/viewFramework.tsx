"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import React, { useState } from 'react'
import { Framework } from "../page";
import { Eye,SquarePen } from "lucide-react";
import PolicyControlsDialog from "./FrameworkEditSection/newEditFrameworkForm";




export default function ViewFramework({frameworks}: {frameworks: Framework[]}) {

    const [openEditForm, setOpenEditForm] = useState(false);
    const [editRow, setEditRow] = useState<Framework | null>(null);

    const handleEditClick = (rowData : Framework) => {
        setOpenEditForm(true);
        setEditRow(rowData);
    }
    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {frameworks.map((framework) => (
                    <Dialog key={framework.id}>
                        <DialogTrigger asChild>
                            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                                <CardHeader>
                                    <CardTitle>{framework.title} antony</CardTitle>
                                    <CardDescription>{framework.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {framework.details}
                                    </p>
                                    <Button variant="link" className="mt-2 h-auto p-0 mr-5">
                                        View details <Eye className="ml-0 h-4 w-4" />
                                    </Button>
                                    <Button variant="link" className="mt-2 h-auto p-0" onClick={()=> handleEditClick(framework)}>
                                        Edit Detials <SquarePen />
                                    </Button>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{framework.title}</DialogTitle>
                                <DialogDescription>{framework.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                                    <p className="text-muted-foreground">{framework.details}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        {framework.requirements.map((req, index) => (
                                            <li key={index} className="text-muted-foreground">{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>

        </>
    )
}
