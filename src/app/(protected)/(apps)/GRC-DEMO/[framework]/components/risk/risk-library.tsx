"use client";

import { useState } from "react";
import { 
  Search, 
  ChevronDown,
  Plus,
  Check,
  X
} from "lucide-react";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Separator } from "@/shadcn/ui/separator";
import { cn } from "@/shadcn//lib/utils";
import { RiskScenario } from "../../types/risk";

interface RiskLibraryProps {
  scenarios: RiskScenario[];
}

export function RiskLibrary({ scenarios }: RiskLibraryProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedRisks, setAddedRisks] = useState<string[]>([]);
  
  // Extract unique categories
  const categories = Array.from(
    new Set(scenarios.map((scenario) => scenario.category))
  );

  // Filter scenarios based on search and category
  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = 
      scenario.risk.toLowerCase().includes(search.toLowerCase()) ||
      scenario.description.toLowerCase().includes(search.toLowerCase()) ||
      scenario.vulnerability.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === null || scenario.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddRisk = (id: string) => {
    if (addedRisks.includes(id)) {
      setAddedRisks(addedRisks.filter((riskId) => riskId !== id));
    } else {
      setAddedRisks([...addedRisks, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search risks..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-between">
                Categories
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <ScrollArea className="h-72">
                <div className="p-2">
                  <div
                    className={cn(
                      "flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm",
                      selectedCategory === null
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setSelectedCategory(null)}
                  >
                    <span>All categories</span>
                    {selectedCategory === null && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                  <Separator className="my-1" />
                  {categories.map((category) => (
                    <div
                      key={category}
                      className={cn(
                        "flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm",
                        selectedCategory === category
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span>{category}</span>
                      {selectedCategory === category && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-between">
                Register
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="p-2">
                <div className="flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                  <span>Save to register</span>
                </div>
                <div className="flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                  <span>Export as CSV</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 text-left text-xs uppercase">
              <th className="px-6 py-3 font-semibold">Risk</th>
              <th className="px-6 py-3 font-semibold">Description</th>
              <th className="px-6 py-3 font-semibold">Vulnerability</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold text-center">Add to register</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredScenarios.map((scenario) => (
              <tr key={scenario.id} className="hover:bg-muted/30">
                <td className="px-6 py-4 text-sm">{scenario.risk}</td>
                <td className="px-6 py-4 text-sm">{scenario.description}</td>
                <td className="px-6 py-4 text-sm">{scenario.vulnerability}</td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {scenario.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  {addedRisks.includes(scenario.id) ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm text-muted-foreground">Added</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => handleAddRisk(scenario.id)}
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddRisk(scenario.id)}
                    >
                      Add
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}