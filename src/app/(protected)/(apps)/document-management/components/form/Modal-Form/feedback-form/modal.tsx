'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import FeedbackEmoji from "./FeedbackEmoji"; // Import your components
import FeedbackForm from "./FeedbackForm";
import { useAppDispatch } from '@/store/store';
import { addBreadcrumb } from '@/store/redux/slices/breadcrumbSlice';
import { Textarea } from "@/components/ui/textarea"
import { useAppSelector } from '@/store/store';
// import { selectedEmoji as selectEmoji } from '@/store/redux/slices/overallFeedbackSlice';
import overallFeedbackSelector from '@/store/redux/slices/overallFeedbackSlice';

interface LogoutDialogProps {
    open: boolean;
    onConfirmLogout: () => void;
    onClose: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({ open, onClose, onConfirmLogout }) => {
    // const [selectedEmoji, setSelectedEmoji] = useState<string>("");
    // const selectedEmoji = useAppSelector(overallFeedbackSelector);
    // Retrieve the selected emoji and feedback using the selector
    const selectedFeedback = useAppSelector((state) => state.overallFeedback);
    const selectedEmoji = selectedFeedback.selectedEmoji;
    const [showCheckbox, setShowCheckbox] = useState(false);

    const handleTellUsMoreClick = () => {
        setShowCheckbox(true); // Show checkbox question when the button is clicked
    };

    const handleLogoutAndClose = async () => {
        // Your logout logic here
        // onConfirmLogout();
        // setOpen(false);  // Close the dialog after logout
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-4/5 sm:max-w-[425px] md:max-w-[1024px] lg:max-w-[1024px] max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Feedback Form</DialogTitle>
                </DialogHeader>

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto">
                    <FeedbackEmoji />
                    <FeedbackForm showCheckbox={showCheckbox} onConfirmLogout={() => onConfirmLogout()}/>
                    {selectedEmoji && !showCheckbox && (
                        <Button
                            type="button"
                            // className="bg-blue-500 mt-3 text-white w-full sm:w-auto"
                            className="mt-3 w-full sm:w-auto"
                            onClick={handleTellUsMoreClick}
                        >
                            Tell Us More
                        </Button>
                    )}
                </div>

                {/* Footer Section */}
                <DialogFooter className="flex flex-wrap gap-2 justify-between sm:justify-end sticky">
                    <Button
                        type="button"
                        // className="bg-gray-500 text-white w-full sm:w-auto"
                        className="w-full sm:w-auto"
                        onClick={() => onConfirmLogout()}
                    >
                        Skip And Logout
                    </Button>
                    <Button
                        form="feedBackForm"
                        type="submit"
                        // className="bg-blue-500 text-white w-full sm:w-auto"
                        className="w-full sm:w-auto"
                        // onClick={() => onConfirmLogout()}
                    >
                        Submit And Logout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
