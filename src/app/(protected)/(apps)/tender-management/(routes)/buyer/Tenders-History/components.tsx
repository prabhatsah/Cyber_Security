"use client";
import {
  EllipsisVertical,
  File,
  FileCode,
  FileImage,
  FilePlus,
  FileText,
  Folder,
  Icon,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import OpenFileModal from "./uploaded-files-dt/file-dt";

function FolderItem({ item }: { item: any }) {
  console.log("item", item);

  const [isOpen, setIsOpen] = useState(false);

  // const [showMenu, setShowMenu] = useState(false);
  // const [menuPosition, setMenuPosition] = useState<{
  //   top: number;
  //   left: number;
  // } | null>(null);

  // const folderRef = useRef<HTMLDivElement | null>(null);
  // const menuRef = useRef<HTMLDivElement | null>(null);

  // const toggleMenu = (e: React.MouseEvent) => {
  //   const folderRect = folderRef.current?.getBoundingClientRect();
  //   if (folderRect) {
  //     setMenuPosition({
  //       top: folderRect.bottom + window.scrollY - 20, // Place the menu below the folder
  //       left: folderRect.left + window.scrollX + 180, // Align it with the left side of the folder
  //     });
  //   }
  //   setShowMenu((prev) => !prev); // Toggle menu visibility
  // };

  // // Close menu when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       folderRef.current &&
  //       !folderRef.current.contains(event.target as Node) &&
  //       menuRef.current &&
  //       !menuRef.current.contains(event.target as Node)
  //     ) {
  //       setShowMenu(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <>
      {/* <div
        ref={folderRef}
        className="folderStructure border bg-gray-800 rounded-md p-4 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer hover:bg-accent"
      >
        <div className="flex gap-8 items-center justify-between">
          <div className="icon">
            <Folder size={20} />
          </div>
          <div className="name">
            <span
              className=""
              style={{
                width: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
              title={item?.department}
            >
              {item?.department}
            </span>
          </div>
          <div
            className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
            onClick={toggleMenu}
          >
            <EllipsisVertical size={20} />
          </div>
        </div>
      </div> */}
      <div
        className="bg-accent p-4 rounded-lg shadow-lg hover:bg-opacity-80 transition-all cursor-pointer"
        onClick={toggleModal}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Folder className="w-5 h-5 text-dark-accent" />
            <span
              className=""
              style={{
                width: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
              title={item?.department}
            >
              {item?.department}
            </span>
          </div>
          {/* <button className="text-dark-muted hover:text-dark-text transition-colors" >
            <MoreVertical className="w-5 h-5" />
          </button> */}
        </div>
      </div>
      {/* Dropdown Menu */}
      {/* {showMenu && menuPosition && (
        <div
          ref={menuRef}
          className="absolute bg-white shadow-lg rounded-md border border-gray-300 z-10"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: "160px",
          }}
        >
          <ul className="py-2 text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Delete
            </li>
          </ul>
        </div>
      )} */}
      {/* <FolderDetailsModal
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        item={item} // Pass the item to the modal
        /> */}
      <OpenFileModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        department={item?.department}
      />
    </>
  );
}

export default FolderItem;
