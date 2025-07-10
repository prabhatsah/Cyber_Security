"use client"
import { useState } from "react";
import ButtonWithTooltip from '@/components/ikon-components/buttonWithTooltip';
import { Archive, House } from "lucide-react";


interface ArchiveButtonProps {
    viewArchived: boolean;
    setViewArchived: React.Dispatch<React.SetStateAction<boolean>>; // This type is for the setState function

}
const ArchiveButton: React.FC<ArchiveButtonProps> = ({ viewArchived, setViewArchived }) => {
    const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

    // Toggle modal function
    const toggleModal = () => {
        setModalOpen((prev) => !prev);  // Toggle modal visibility
        setViewArchived((prev) => !prev);

    };
    return (
        <>
            <ButtonWithTooltip tooltip={viewArchived ? "Main List" : "Archive List"} icon={viewArchived ? <House /> : <Archive />} text={''} onClick={toggleModal} />
        </>
    )
}


export default ArchiveButton;


