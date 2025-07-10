import React, { useState } from "react";
import { formatRawBacnetData } from "../../../../../utils/fomatRawBacnetData"; // Ensure the correct relative path

interface DelimiterInputProps {
  data: any[];
  onDataProcessed: (processedData: any[]) => void; // Callback to send processed data
}

export default function DelimiterInput({ data, onDataProcessed }: DelimiterInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("Input Value:", inputValue);
      console.log("Received Data:", data);

      // Process the data
      const formattedBacnetData = await formatRawBacnetData(data);

      // Generate treeData dynamically
      const treeData = generateTreeData(formattedBacnetData);

      console.log("Generated Tree Data:", treeData);

      // Send the processed treeData to the parent component
      onDataProcessed(treeData);
    } catch (error) {
      console.error("Error formatting Bacnet data:", error);
    }
  };

  const generateTreeData = (data: any[]) => {
    const levels = ["site", "system", "subSystem", "systemType", "serviceName"];
    const tree: any[] = [];
  
    data.forEach((item) => {
      let currentLevel = tree;
      let path: string[] = [];
      levels.forEach((level, idx) => {
        if (!item[level]) return; // skip missing levels
        path.push(item[level]);
        let id = path.join(" > ");
        let node = currentLevel.find((n: any) => n.id === id);
        if (!node) {
          node = {
            id,
            label: item[level],
            children: [],
          };
          // If this is the last present level, attach data fields
          if (
            idx === levels.length - 1 ||
            !item[levels[idx + 1]]
          ) {
            Object.assign(node, {
              description: item.description || "",
              status: item.present_value || "",
              object_id: item.object_id,
              object_type: item.object_type,
              units: item.units,
              data_received_on: item.data_received_on,
            });
          }
          currentLevel.push(node);
        }
        currentLevel = node.children;
      });
    });
  
    return tree;
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter text here"
        className="border p-2 rounded"
      />
      <button onClick={handleSubmit} className="ml-2 p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </div>
  );
}
