import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

const MultiSelectDropdown = ({ items, label, placeholder, onSelect, tableData }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [weights, setWeights] = useState({}); // Store weights for selected items
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate the total weight already assigned to a framework across all controls
  const calculateTotalWeight = (frameworkId) => {
    // Ensure tableData is defined and not empty
    if (!tableData || tableData.length === 0) {
      return 0; // If no data, assume the total weight is 0
    }
  
    return tableData.reduce((total, control) => {
      const framework = control.frameworks.find((fw) => fw.id === frameworkId);
      return total + (framework ? parseInt(framework.weight, 10) : 0);
    }, 0);
  };
  const toggleItem = (value) => {
    let updatedItems;
    if (selectedItems.some((item) => item.value === value)) {
      updatedItems = selectedItems.filter((item) => item.value !== value);
      const updatedWeights = { ...weights };
      delete updatedWeights[value]; // Remove weight for deselected item
      setWeights(updatedWeights);
    } else {
      updatedItems = [...selectedItems, { value, weight: 0 }];
    }
    setSelectedItems(updatedItems);
    onSelect &&
      onSelect(
        updatedItems.map((item) => ({
          value: item.value,
          weight: weights[item.value] || 0, // Include weight in the callback
        }))
      );
  };

  const handleWeightChange = (value, weight) => {
    const totalWeight = calculateTotalWeight(value); // Get the total weight for the framework
    const remainingWeight = 100 - totalWeight; // Calculate the remaining weight

    if (weight > remainingWeight) {
      alert(`You can only assign up to ${remainingWeight} weight for this framework.`);
      return;
    }

    const updatedWeights = { ...weights, [value]: weight };
    setWeights(updatedWeights);
    onSelect &&
      onSelect(
        selectedItems.map((item) => ({
          value: item.value,
          weight: updatedWeights[item.value] || 0, // Include updated weight in the callback
        }))
      );
  };

  const handleDropdownToggle = (e) => {
    // Prevent dropdown toggle when interacting with weight input
    if (e.target.tagName === "INPUT") return;
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      {label && <label className="block mb-2 text-sm font-medium text-gray-300">{label}</label>}
      <div className="relative">
        <button
          type="button"
          className="w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm text-left flex justify-between items-center  text-gray-300"
          onClick={handleDropdownToggle}
        >
          <div className="flex flex-wrap gap-2">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <span
                  key={item.value}
                  className="px-2 py-1 bg-gray-700 rounded-md flex items-center space-x-2 text-gray-300"
                >
                  {items.find((fw) => fw.value === item.value)?.label || item.value}
                  <input
                    type="number"
                    min="0"
                    value={weights[item.value] || ""}
                    onChange={(e) => handleWeightChange(item.value, parseInt(e.target.value, 10))}
                    className="w-12 px-1 py-0.5 border border-gray-600 rounded-md text-sm bg-gray-800 text-gray-300 ms-2"
                    placeholder=""
                  />
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="w-5 h-5 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-[#0d0d0d] border border-gray-600 rounded-md shadow-lg">
            <input
              type="text"
              className="w-full px-3 py-2 border-b border-gray-600 focus:outline-none bg-gray-700 text-gray-300 placeholder-gray-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="max-h-40 overflow-auto py-2">
              {items
                .filter((item) =>
                  item.label.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <li
                    key={item.value}
                    className="px-4 py-2 flex justify-between items-center cursor-pointer text-gray-300 hover:bg-gray-700"
                    onClick={() => toggleItem(item.value)}
                  >
                    {item.label}
                    {selectedItems.some((fw) => fw.value === item.value) && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;