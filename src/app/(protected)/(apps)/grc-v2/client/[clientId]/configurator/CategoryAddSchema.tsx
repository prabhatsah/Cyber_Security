import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
import { Edit } from 'lucide-react';

// Helper function to generate UUIDs (using Web Crypto API)
const generateUUID = () => crypto.randomUUID();

type RiskCategory = { id: string; name: string };
type CategoryAddSchemaProps = {
  mode?: 'view' | 'edit';
  initialData?: RiskCategory[];
  onSave?: (categories: RiskCategory[]) => void;
  onClose?: () => void;
};

const CategoryAddSchema: React.FC<CategoryAddSchemaProps> = ({
  mode = 'edit',
  initialData = [],
  onSave,
  onClose,
}) => {
  const [riskCategoryInput, setRiskCategoryInput] = useState('');
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    setRiskCategories(initialData);
    setIsLoading(false);
  }, [initialData]);

  // Add or update category
  const handleAddCategory = useCallback(() => {
    if (riskCategoryInput.trim() === '') {
      // Show a toast or alert in a real app
      return;
    }
    if (editingId) {
      setRiskCategories(prev =>
        prev.map(cat =>
          cat.id === editingId ? { ...cat, name: riskCategoryInput.trim() } : cat
        )
      );
      setEditingId(null);
    } else {
      setRiskCategories(prev => [
        ...prev,
        { id: generateUUID(), name: riskCategoryInput.trim() },
      ]);
    }
    setRiskCategoryInput('');
  }, [riskCategoryInput, editingId]);

  // Clear input and editing state
  const handleClearInput = useCallback(() => {
    setRiskCategoryInput('');
    setEditingId(null);
  }, []);

  // Edit category
  const handleEditTableItem = useCallback((category: RiskCategory) => {
    setRiskCategoryInput(category.name);
    setEditingId(category.id);
  }, []);

  // Save categories
  const handleInternalSave = useCallback(() => {
    onSave?.(riskCategories);
  }, [riskCategories, onSave]);

  const isInputDisabled = mode === 'view';

  if (isLoading) {
    return <div className="text-center p-4">Loading categories...</div>;
  }

  return (
    <div className="p-4">
      <div className="grid gap-4 mb-6">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="riskCategory">Risk Category</Label>
          <Input
            id="riskCategory"
            placeholder="Enter risk category"
            value={riskCategoryInput}
            onChange={(e) => setRiskCategoryInput(e.target.value)}
            disabled={isInputDisabled}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={handleAddCategory} disabled={isInputDisabled}>
            {editingId ? 'Update' : 'ADD'}
          </Button>
          <Button variant="outline" onClick={handleClearInput} disabled={isInputDisabled}>
            CLEAR
          </Button>
        </div>
      </div>

      <div className="relative overflow-auto max-h-[300px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[50px]">SL No</TableHead>
              <TableHead>Risk Category</TableHead>
              <TableHead className="w-[80px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {riskCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No risk categories added yet.
                </TableCell>
              </TableRow>
            ) : (
              riskCategories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTableItem(category)}
                      disabled={isInputDisabled}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};

export default CategoryAddSchema;