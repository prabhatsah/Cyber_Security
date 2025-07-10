import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shadcn/ui/tabs"
import { BasicDetailsTab } from "./tabs/basic-details-tab"
import { ExpressionsTab } from "./tabs/expressions-tab"
import { ConditionGeneratorTab } from "./tabs/condition-generator-tab"
import { AlertTab } from "./tabs/alert-tab"
import type { UseFormReturn } from "react-hook-form"

interface LogoutDialogProps {
    onClose: () => void;
    form: UseFormReturn<any>
}

export function CreateNotification({ onClose, form }: LogoutDialogProps) {
    return (
        <Tabs defaultValue="basic-details">
            <TabsList className="flex justify-between w-full">
                <TabsTrigger value="basic-details">Basic Details</TabsTrigger>
                <TabsTrigger value="expressions">Expressions</TabsTrigger>
                <TabsTrigger value="condition-generator">Condition Generator</TabsTrigger>
                <TabsTrigger value="alert">Alert Setting</TabsTrigger>
            </TabsList>
            <TabsContent value="basic-details">
                <BasicDetailsTab form={form}/>
            </TabsContent>
            <TabsContent value="expressions">
                <ExpressionsTab />
            </TabsContent>
            <TabsContent value="condition-generator">
                <ConditionGeneratorTab />
            </TabsContent>
            <TabsContent value="alert">
                <AlertTab form={form}/>
            </TabsContent>
        </Tabs>
    )
}
