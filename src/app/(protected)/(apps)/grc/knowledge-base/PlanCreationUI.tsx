"use client";

import React, { useState, useEffect, useMemo } from "react";

// --- UI Components ---
const Checkbox = ({ id, ...props }) => (
  <input
    type="checkbox"
    id={id}
    {...props}
    className="mr-2 rounded border-gray-600 bg-gray-700 text-indigo-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50 focus:ring-offset-gray-800 disabled:opacity-50 cursor-pointer flex-shrink-0"
  />
);

const Button = ({ variant = "default", children, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed ${
      variant === "outline"
        ? "border border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    } ${props.className || ""}`}
  >
    {children}
  </button>
);

const Input = ({ hasIcon = false, ...props }) => (
  <input
    {...props}
    className={`block w-full rounded-md border-gray-600 bg-gray-700 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-opacity-50 sm:text-sm placeholder-gray-400 ${
      hasIcon ? "pl-10" : "pl-3"
    } pr-3 py-2 ${props.className || ""}`}
  />
);

const Table = ({ children, ...props }) => (
  <table
    {...props}
    className={`min-w-full divide-y divide-gray-700 table-fixed ${
      props.className || ""
    }`}
  >
    {children}
  </table>
);

const TableHeader = ({ children, ...props }) => (
  <thead
    {...props}
    className={`bg-gray-700 sticky top-0 z-10 ${props.className || ""}`}
  >
    {children}
  </thead>
);

const TableRow = ({ children, ...props }) => (
  <tr {...props} className={`${props.className || ""}`}>
    {children}
  </tr>
);

const TableHead = ({ children, ...props }) => (
  <th
    {...props}
    scope="col"
    className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
      props.className || ""
    }`}
  >
    {children}
  </th>
);

const TableBody = ({ children, ...props }) => (
  <tbody
    {...props}
    className={`bg-gray-800 divide-y divide-gray-700 ${props.className || ""}`}
  >
    {children}
  </tbody>
);

const TableCell = ({ children, ...props }) => (
  <td
    {...props}
    className={`px-4 py-3 whitespace-nowrap text-sm truncate ${
      props.className || "text-gray-200"
    }`}
  >
    {children}
  </td>
);

const ScrollArea = ({ children, className, ...props }) => (
  <div
    {...props}
    className={`overflow-y-auto bg-gray-800 ${className || ""}`}
    style={{ maxHeight: "9rem" }}
  >
    {children}
  </div>
);

const Select = ({ children, value, onChange, ...props }) => (
  <select
    value={value}
    onChange={onChange}
    {...props}
    className={`block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
      props.className || ""
    }`}
  >
    {children}
  </select>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

// Extract unique values for filter options from the data
const getFilterOptions = (filteredData) => {
  const practiceAreas = new Set<string>();
  const controlObjTypes = new Set<string>();
  const policyNames = new Set<string>();

  filteredData?.forEach((item) => {
    if (item.practiceAreas) practiceAreas.add(item.practiceAreas);
    if (item.controlObjType) controlObjTypes.add(item.controlObjType);
    if (item.policylame) policyNames.add(item.policylame);
  });

  return {
    "Policy Names": Array.from(policyNames),
    "Practice Areas": Array.from(practiceAreas),
    "Control Types": Array.from(controlObjTypes),
  };
};

export default function PlanCreationUI({ filteredData, controlData }) {
  const [selectedObjectives, setSelectedObjectives] = useState({});
  const [selectedPolicies, setSelectedPolicies] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [collapsedPolicies, setCollapsedPolicies] = useState({});

  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [tableSearchTerm, setTableSearchTerm] = useState("");

  // State for Filter Search Terms
  const [filterSearchTerms, setFilterSearchTerms] = useState({
    "Policy Names": "",
    "Practice Areas": "",
    "Control Types": "",
  });

  // Get filter options from actual data
  const filterOptions = useMemo(
    () => getFilterOptions(filteredData),
    [filteredData]
  );

  // Transform controlData into table-friendly format
  const tableData = useMemo(() => {
    if (!controlData || controlData.length === 0) return [];

    return controlData.map((control) => {
      const objectives =
        control.controlObjectives?.map((obj) => ({
          id: obj.controlsOfId,
          objective: obj.name,
          description: obj.description,
          weight: obj.controlsHeight,
          area: obj.practicesArea,
          type: obj.controlsType,
          policyId: control.policyId, // Using control.id as policyId
        })) || [];

      return {
        policyId: control.policyId, // This is the control ID
        policyName: control.controlName, // This is the control name
        objectives,
        framework: control.framework,
        frameworkId: control.frameworkId,
      };
    });
  }, [controlData]);

  // Initialize collapsed state
  useEffect(() => {
    if (tableData.length > 0) {
      const initialCollapsed = {};
      tableData.forEach((p) => (initialCollapsed[p.policyId] = true));
      setCollapsedPolicies(initialCollapsed);
    }
  }, [tableData]);

  // Calculate filtered and aggregated data
  const { processedData, totalObjectives, totalPolicies } = useMemo(() => {
    let objectiveCount = 0;
    const filteredData = tableData.filter((policy) => {
      const term = tableSearchTerm.toString().toLowerCase();
      if (policy.policyName.toString().toLowerCase().includes(term))
        return true;
      return policy.objectives.some((obj) =>
        obj.name.toLowerCase().includes(term)
      );
    });

    const dataWithAggregates = filteredData.map((policy) => {
      const policyWeight = policy.objectives.reduce(
        (sum, obj) => sum + (obj.weight || 0),
        0
      );
      const uniqueAreas = [
        ...new Set(policy.objectives.map((obj) => obj.area)),
      ].join(", ");
      objectiveCount += policy.objectives.length;
      return {
        ...policy,
        totalWeight: policyWeight,
        procAreas: uniqueAreas || "N/A",
      };
    });

    return {
      processedData: dataWithAggregates,
      totalObjectives: objectiveCount,
      totalPolicies: dataWithAggregates.length,
    };
  }, [tableData, tableSearchTerm]);

  // Pagination calculations
  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  // Check if all policies are expanded or collapsed
  const allExpanded = useMemo(() => {
    if (processedData.length === 0) return false;
    return processedData.every(
      (policy) => collapsedPolicies[policy.policyId] === false
    );
  }, [collapsedPolicies, processedData]);

  const allCollapsed = useMemo(() => {
    if (processedData.length === 0) return false;
    return processedData.every(
      (policy) => collapsedPolicies[policy.policyId] === true
    );
  }, [collapsedPolicies, processedData]);

  // Handler functions
  const handleTableSearchChange = (e) => {
    setTableSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleFilterSearchChange = (filterType, value) => {
    setFilterSearchTerms((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    // Update selected policies
    const newSelectedPolicies = { ...selectedPolicies };
    const newSelectedObjectives = { ...selectedObjectives };

    processedData.forEach((policy) => {
      newSelectedPolicies[policy.policyId] = isChecked;
      policy.objectives.forEach((obj) => {
        newSelectedObjectives[obj.id] = isChecked;
      });
    });

    setSelectedPolicies(newSelectedPolicies);
    setSelectedObjectives(newSelectedObjectives);
  };

  const handlePolicyCheckboxChange = (policyId, objectives) => {
    const isChecked = !selectedPolicies[policyId];
    const newSelectedPolicies = { ...selectedPolicies, [policyId]: isChecked };
    const newSelectedObjectives = { ...selectedObjectives };

    // If policy has objectives, toggle all of them
    if (objectives.length > 0) {
      objectives.forEach((obj) => {
        newSelectedObjectives[obj.id] = isChecked;
      });
    }

    setSelectedPolicies(newSelectedPolicies);
    setSelectedObjectives(newSelectedObjectives);
  };

  const handleObjectiveCheckboxChange = (objectiveId, policyId) => {
    const isChecked = !selectedObjectives[objectiveId];
    const newSelectedObjectives = {
      ...selectedObjectives,
      [objectiveId]: isChecked,
    };

    // Check if all objectives for this policy are now selected
    const policy = tableData.find((p) => p.policyId === policyId);
    if (policy) {
      const allSelected = policy.objectives.every(
        (obj) => newSelectedObjectives[obj.id]
      );
      setSelectedPolicies((prev) => ({
        ...prev,
        [policyId]: allSelected,
      }));
    }

    setSelectedObjectives(newSelectedObjectives);
  };

  const togglePolicyCollapse = (policyId) => {
    setCollapsedPolicies((prev) => ({
      ...prev,
      [policyId]: !prev[policyId],
    }));
  };

  const handleExpandAll = () => {
    const expanded = {};
    processedData.forEach((policy) => {
      expanded[policy.policyId] = false;
    });
    setCollapsedPolicies(expanded);
  };

  const handleCollapseAll = () => {
    const collapsed = {};
    processedData.forEach((policy) => {
      collapsed[policy.policyId] = true;
    });
    setCollapsedPolicies(collapsed);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Helper function to render filter groups
  const renderFilterGroup = (title, options, searchTerm, onChange) => {
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div key={title} className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {title}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => onChange(title, e.target.value)}
            hasIcon={true}
            className="pl-8 py-1 text-sm"
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>
        <ScrollArea>
          <div className="space-y-2 py-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <Checkbox id={`${title}-${option}`} />
                  <label
                    htmlFor={`${title}-${option}`}
                    className="text-sm text-gray-300 ml-2 truncate"
                    title={option}
                  >
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic py-2 text-center">
                No options found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Effect 1: Sync 'Select All' checkbox state
  useEffect(() => {
    let isAllFilteredSelected = totalPolicies > 0;

    if (isAllFilteredSelected) {
      for (const policy of processedData) {
        if (!selectedPolicies[policy.policyId]) {
          isAllFilteredSelected = false;
          break;
        }
        if (
          policy.objectives.length > 0 &&
          !policy.objectives.every((obj) => selectedObjectives[obj.id])
        ) {
          isAllFilteredSelected = false;
          break;
        }
      }
    }
    setSelectAll(isAllFilteredSelected);
  }, [selectedPolicies, selectedObjectives, processedData, totalPolicies]);

  // Effect 2: Sync parent policy checkbox when child objectives change
  useEffect(() => {
    const updatedPoliciesState = { ...selectedPolicies };
    let needsUpdate = false;

    tableData.forEach((policy) => {
      const policyObjectives = policy.objectives;
      const currentPolicyIsSelected = !!selectedPolicies[policy.policyId];

      if (policyObjectives.length > 0) {
        const allChildrenAreSelected = policyObjectives.every(
          (obj) => selectedObjectives[obj.id]
        );
        if (currentPolicyIsSelected !== allChildrenAreSelected) {
          updatedPoliciesState[policy.policyId] = allChildrenAreSelected;
          needsUpdate = true;
        }
      } else {
        if (currentPolicyIsSelected) {
          updatedPoliciesState[policy.policyId] = false;
          needsUpdate = true;
        }
      }
    });

    if (needsUpdate) {
      setSelectedPolicies(updatedPoliciesState);
    }
  }, [selectedObjectives, tableData]);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Filters Section */}
      <div className="space-y-4 p-4 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
          Filters
        </div>
        <div className="grid md:grid-cols-3 gap-0 md:gap-6">
          {Object.entries(filterOptions).map(([title, options]) =>
            renderFilterGroup(
              title,
              options,
              filterSearchTerms[title],
              handleFilterSearchChange
            )
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700 mt-4">
          <Button variant="outline">Reset Filters</Button>
          <Button>Apply Filters</Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-700/50">
          <div className="flex-grow w-full md:w-auto">
            <h2 className="text-lg font-semibold text-gray-100 mb-2 md:mb-0">
              Control Policies & Objectives
            </h2>
          </div>
          <div className="relative w-full md:w-1/3 lg:w-1/4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              type="search"
              value={tableSearchTerm}
              onChange={handleTableSearchChange}
              hasIcon={true}
              aria-label="Search table policies and objectives"
            />
          </div>
          <div className="space-x-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleExpandAll}
              disabled={allExpanded || totalPolicies === 0}
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              onClick={handleCollapseAll}
              disabled={allCollapsed || totalPolicies === 0}
            >
              Collapse All
            </Button>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto max-h-[65vh] relative border-t border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16" style={{ width: "4rem" }}>
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    aria-label="Select all currently filtered policies and objectives"
                    disabled={totalPolicies === 0}
                  />
                </TableHead>
                <TableHead style={{ width: "25%" }}>Control Name</TableHead>
                <TableHead style={{ width: "10%" }}>Control ID</TableHead>
                <TableHead style={{ width: "25%" }}>
                  Objective Description
                </TableHead>
                <TableHead className="text-right" style={{ width: "10%" }}>
                  Weight (%)
                </TableHead>
                <TableHead style={{ width: "10%" }}>Practice Area</TableHead>
                <TableHead style={{ width: "10%" }}>Control Type</TableHead>
                <TableHead style={{ width: "10%" }}>Framework</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTableData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-gray-500 py-10"
                  >
                    {tableSearchTerm
                      ? "No controls match your table search."
                      : "No control policies found."}
                  </TableCell>
                </TableRow>
              ) : (
                currentTableData.map((policy) => {
                  const isCollapsed =
                    collapsedPolicies[policy.policyId] !== false;
                  const hasObjectives = policy.objectives.length > 0;
                  return (
                    <React.Fragment key={policy.policyId}>
                      {/* Policy Row */}
                      <TableRow className="bg-gray-700/40 hover:bg-gray-700/60 border-b border-gray-600/50">
                        <TableCell className="w-16" style={{ width: "4rem" }}>
                          <div className="flex items-center">
                            <Checkbox
                              id={`policy-${policy.policyId}`}
                              checked={!!selectedPolicies[policy.policyId]}
                              onChange={() =>
                                handlePolicyCheckboxChange(
                                  policy.policyId,
                                  policy.objectives
                                )
                              }
                              aria-label={`Select control ${policy.policyName}`}
                              disabled={!hasObjectives}
                            />
                            {hasObjectives && (
                              <button
                                onClick={() =>
                                  togglePolicyCollapse(policy.policyId)
                                }
                                className="ml-1 text-gray-400 hover:text-gray-200"
                                aria-expanded={!isCollapsed}
                                aria-controls={`objectives-${policy.policyId}`}
                                title={isCollapsed ? "Expand" : "Collapse"}
                              >
                                {isCollapsed ? ">" : "v"}
                              </button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className="font-semibold text-gray-100 cursor-pointer"
                          onClick={() =>
                            hasObjectives &&
                            togglePolicyCollapse(policy.policyId)
                          }
                          title={policy.policyName}
                        >
                          {policy.policyName}
                        </TableCell>
                        <TableCell className="font-medium text-gray-300">
                          {policy.policyId}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-medium text-gray-300">
                          {policy.totalWeight > 0
                            ? policy.totalWeight.toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell
                          className="text-gray-300"
                          title={policy.procAreas}
                        >
                          {policy.procAreas}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {/* Objective Rows */}
                      {!isCollapsed &&
                        hasObjectives &&
                        policy.objectives.map((obj) => (
                          <TableRow
                            key={obj.id}
                            className="hover:bg-gray-700/80 bg-gray-800"
                            id={`objectives-${policy.policyId}`}
                          >
                            <TableCell
                              className="w-16 pl-8"
                              style={{ width: "4rem" }}
                            >
                              <Checkbox
                                id={`row-${obj.id}`}
                                checked={!!selectedObjectives[obj.id]}
                                onChange={() =>
                                  handleObjectiveCheckboxChange(
                                    obj.id,
                                    policy.policyId
                                  )
                                }
                                aria-labelledby={`objective-desc-${obj.id}`}
                              />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell
                              id={`objective-desc-${obj.id}`}
                              title={obj.objective}
                            >
                              {obj.objective}
                            </TableCell>
                            <TableCell className="text-right">
                              {obj.weight.toFixed(2)}
                            </TableCell>
                            <TableCell title={obj.area}>{obj.area}</TableCell>
                            <TableCell title={obj.type}>{obj.type}</TableCell>
                            <TableCell>{policy.framework}</TableCell>
                          </TableRow>
                        ))}
                      {!isCollapsed && !hasObjectives && (
                        <TableRow
                          className="bg-gray-800/50"
                          id={`objectives-${policy.policyId}`}
                        >
                          <TableCell
                            className="w-16 pl-8"
                            style={{ width: "4rem" }}
                          ></TableCell>
                          <TableCell
                            colSpan={7}
                            className="text-center text-gray-500 italic py-2"
                          >
                            No objectives defined for this control.
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-700/50 px-4 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-700">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Rows per page</span>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="w-20"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </div>
            <span className="text-sm text-gray-300">
              Showing{" "}
              {processedData.length > 0
                ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    processedData.length
                  )}`
                : "0"}{" "}
              of {processedData.length} policies
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
