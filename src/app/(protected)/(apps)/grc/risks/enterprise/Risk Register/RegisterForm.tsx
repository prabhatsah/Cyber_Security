import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { v4 } from "uuid";
import { invokeRegister } from "./invokeRiskRegister";
import { startRegisterProcess } from "./startRiskRegister";
import { userMap } from "../UserMap";

interface EditContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRegisterId: string | null;  // Nullable for adding new register
}

const RegisterModal: React.FC<EditContactModalProps> = ({ isOpen, onClose, selectedRegisterId }) => {
    const [taskId, setTaskId] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<{ value: string; label: string }[]>([]);
    
    const [registerDetails, setRegisterDetails] = useState({
        riskRegisterId: v4(),
        riskRegisterTitle: "",
        riskRegisterOwner: "",
        riskRegisterDescription: "",
        riskRegisterTimeline: new Date().toISOString().split("T")[0], // Set to current date (YYYY-MM-DD)
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const users = await userMap();
                setUserDetails(users || []);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (selectedRegisterId) {
            (async () => {
                try {
                    const registerData = await getMyInstancesV2<any>({
                        processName: "Add Risk Register",
                        predefinedFilters: { taskName: "Edit Risk Register" },
                        mongoWhereClause: `this.Data.riskRegisterId == "${selectedRegisterId}"`,
                    });

                    if (registerData?.length > 0) {
                        const registerObj = registerData[0].data || {};
                        setTaskId(registerData[0].taskId || null);
                        setRegisterDetails({
                            riskRegisterId: registerObj.riskRegisterId || "",
                            riskRegisterTitle: registerObj.riskRegisterTitle || "",
                            riskRegisterOwner: registerObj.riskRegisterOwner || "",
                            riskRegisterDescription: registerObj.riskRegisterDescription || "",
                            riskRegisterTimeline: registerObj.riskRegisterTimeline || new Date().toISOString().split("T")[0],
                        });
                    }
                } catch (error) {
                    console.error("Error fetching register data:", error);
                }
            })();
        } else {
            setTaskId(null);
            setRegisterDetails({
                riskRegisterId: v4(),
                riskRegisterTitle: "",
                riskRegisterOwner: "",
                riskRegisterDescription: "",
                riskRegisterTimeline: new Date().toISOString().split("T")[0], // Set current date
            });
        }
    }, [selectedRegisterId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRegisterDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSelectChange = (value: string) => {
        setRegisterDetails(prev => ({
            ...prev,
            riskRegisterOwner: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (selectedRegisterId && taskId) {
                await invokeRegister(taskId, registerDetails);
            } else {
                await startRegisterProcess(registerDetails);
            }
            console.log(registerDetails);
            onClose();
        } catch (error) {
            console.error("Error saving register:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{selectedRegisterId ? "Edit" : "Add"} Risk Register</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Risk Title</Label>
                            <Input name="riskRegisterTitle" value={registerDetails.riskRegisterTitle} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Risk Owner</Label>
                            <Select value={registerDetails.riskRegisterOwner} onValueChange={handleSelectChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Risk Owner" />
                                </SelectTrigger>
                                <SelectContent>
                                    {userDetails.map(user => (
                                        <SelectItem key={user.value} value={user.value}>
                                            {user.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="riskRegisterDescription" value={registerDetails.riskRegisterDescription} onChange={handleChange} required />
                    </div>

                    {/* <div className="space-y-2">
                        <Label>Risk Register Timeline</Label>
                        <Input name="riskRegisterTimeline" value={registerDetails.riskRegisterTimeline} disabled readOnly />
                    </div> */}

                    <Button type="submit" className="w-full">
                        {selectedRegisterId ? "Update" : "Add"} Register
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterModal;
