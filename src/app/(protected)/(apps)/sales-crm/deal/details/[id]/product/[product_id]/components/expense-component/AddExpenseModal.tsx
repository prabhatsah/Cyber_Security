import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { calculateFxRate } from "@/app/(protected)/(apps)/sales-crm/utils/Fx-Rate/calculateFxRate";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { countryMap } from "@/app/(protected)/(apps)/sales-crm/deal/country_details";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/shadcn/ui/form";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shadcn/ui/select";
import ExpenseDataTable from "./expenseDataTable";
import { invokeExpenses } from "./invokeExpense";

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    productIdentifier: string;
}

interface ExpenseData {
    id: string;
    expenseName: string;
    location: string;
    currency: string;
    cost: number;
    quantity: number;
    description: string;
    totalCost: number;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, productIdentifier }) => {
    const [expenseDetails, setExpenseDetails] = useState<Record<string, ExpenseData>>({});
    const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
    const [fxRates, setFxRates] = useState<Record<string, number>>({});
    
    const form = useForm<ExpenseData>({
        defaultValues: {
            expenseName: "",
            location: "",
            currency: "USD",
            cost: 0,
            quantity: 0,
            description: "",
            totalCost: 0,
        },
    });

    // Fetch Expenses Data
    useEffect(() => {
        if (productIdentifier) {
            (async () => {
                try {
                    const productData = await getMyInstancesV2<any>({
                        processName: "Product",
                        predefinedFilters: { taskName: "Expenses" },
                        mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
                    });

                    if (productData?.length > 0) {
                        const expensesObj = productData[0].data.expenseDetails || {};
                        setExpenseDetails(expensesObj);
                    }
                } catch (error) {
                    console.error("Error fetching expense data:", error);
                }
            })();
        }
    }, [productIdentifier]);

    // Fetch FX Rate only when the currency changes
    const fetchFxRate = useCallback(async (currency: string) => {
        if (!fxRates[currency]) {
            const rate = await calculateFxRate(currency, "USD");
            setFxRates((prevRates) => ({ ...prevRates, [currency]: rate }));
        }
    }, [fxRates]);

    // Calculate `totalCost` whenever cost, quantity, or currency changes
    useEffect(() => {
        const subscription = form.watch(({ cost, quantity, currency }) => {
            if (cost && quantity && currency) {
                fetchFxRate(currency); // Fetch FX rate if not available
            }
        });
    
        return () => subscription.unsubscribe();
    }, [form, fetchFxRate]);
    
    useEffect(() => {
        const { cost, quantity, currency } = form.getValues();
        if (cost && quantity && currency) {
            const fxRate = fxRates[currency] || 1;
            const totalCost = Number(cost) * Number(quantity) * fxRate;
    
            if (form.getValues("totalCost") !== totalCost) {
                form.setValue("totalCost", totalCost, { shouldValidate: true });
            }
        }
    }, [fxRates, form]); 

    const handleAddOrUpdate = async (data: ExpenseData) => {
        const fxRate = fxRates[data.currency] || 1;
        const totalCost = Number(data.cost) * Number(data.quantity) * fxRate;
    
        const expenseId = editingExpenseId || v4(); // Generate a new UUID if not editing
    
        const newExpense: ExpenseData = {
            ...data,
            cost: Number(data.cost),
            quantity: Number(data.quantity),
            totalCost,
        };
    
        setExpenseDetails((prev) => ({
            ...prev,
            [expenseId]: newExpense, // Store expense under a unique ID
        }));
    
        setEditingExpenseId(null);
        form.reset();
    };
    
    const handleEdit = (id: string) => {
        const expenseToEdit = expenseDetails[id];
        if (expenseToEdit) {
            form.reset(expenseToEdit);
            setEditingExpenseId(id);
        }
    };

    const handleSave = async () => {
        try {
            const productData = await getMyInstancesV2({
                processName: "Product",
                predefinedFilters: { taskName: "Expenses" },
                mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
            });
    
            if (productData?.length > 0) {
                const { taskId, data: currentData } = productData[0];
    
                const updatedProductData = {
                    ...(currentData || {}),
                    expenseDetails: expenseDetails, // Keep the object format
                };
    
                console.log("Updated Product Data:", updatedProductData);
                await invokeExpenses(taskId, updatedProductData);
                onClose();
            }
        } catch (error) {
            console.error("Error saving expense data:", error);
        }
    };

    // Convert expenseDetails object to an array for the table
    const expenseArray = Object.keys(expenseDetails).map((uuid) => ({
        uuid,
        ...expenseDetails[uuid]
    }));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Expense</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddOrUpdate)} className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-3 gap-3">
                            <FormField
                                control={form.control}
                                name="expenseName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expense Name*</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter expense name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location*</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countryMap.map((option: any) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.label}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency*</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["USD", "GBP", "INR", "QAR", "SAR", "AED"].map((currency) => (
                                                        <SelectItem key={currency} value={currency}>
                                                            {currency}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cost per unit*</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" placeholder="0" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity*</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" placeholder="0" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Cost*</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Enter description" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row items-center justify-end">
                            <Button type="submit" size="sm">
                                {editingExpenseId ? "Update" : "Add"}
                            </Button>
                        </div>
                    </form>
                </Form>
                <ExpenseDataTable expenseDetails={expenseArray} onEdit={handleEdit} />
                <DialogFooter>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseModal;
