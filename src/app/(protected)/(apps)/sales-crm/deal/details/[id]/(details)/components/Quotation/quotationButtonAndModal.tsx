'use client'
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/shadcn/ui/form";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import FormInput from "@/ikon/components/form-fields/input";
import { TextButton } from "@/ikon/components/buttons";
import { invokeQuotation } from "./invokeQuotation";
import QuotationProductDataTable, {QuotationProductDataTableRef,} from "./productTableForQuotation";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

interface QuotationModalProps {
  currency: string;
  dealIdentifier: string;
  productIdentifierWiseDataObj: any[]; // new data structure: array of objects
}

interface FormData {
  quotationComment: string;
}

const QuotationButtonAndModal: React.FC<QuotationModalProps> = ({ productIdentifierWiseDataObj, currency, dealIdentifier }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [vatPercentage, setVatPercentage] = useState(0);
  const [discountedBillingAmount, setDiscountedBillingAmount] = useState(0);
  const [finalBillingAmount, setFinalBillingAmount] = useState(0);
  const [finalBillingAmountIncludingVAT, setFinalBillingAmountIncludingVAT] = useState(0);

  const tableRef = useRef<QuotationProductDataTableRef>(null);

  const form = useForm<FormData>({
    defaultValues: { quotationComment: "" },
  });

  const calculateBillingAmounts = (discount: number, vat: number) => {
    let billingAmount = 0;
    if (tableRef.current && typeof tableRef.current.getTotalBillingAmount === "function") {
      billingAmount = tableRef.current.getTotalBillingAmount();
    }
    const discountAmount = (billingAmount * discount) / 100;
    const finalAmount = billingAmount - discountAmount;
    const finalAmountWithVAT = finalAmount + (finalAmount * vat) / 100;

    setDiscountedBillingAmount(discountAmount);
    setFinalBillingAmount(finalAmount);
    setFinalBillingAmountIncludingVAT(finalAmountWithVAT);
  };

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        calculateBillingAmounts(discountPercentage, vatPercentage);
      }, 100); // 100ms delay; adjust if needed
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, discountPercentage, vatPercentage]);

  const handleDiscountChange = (value: number) => {
    setDiscountPercentage(value);
    calculateBillingAmounts(value, vatPercentage);
  };

  const handleVatChange = (value: number) => {
    setVatPercentage(value);
    calculateBillingAmounts(discountPercentage, value);
  };
  const onSubmit = async (data: FormData) => {
    const Quotation = await getMyInstancesV2<any>({
      processName: "Deal",
      predefinedFilters: { taskName: "Edit Quotation" },
      mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
    });
    const QuotationData = Quotation[0].data;
    const taskId = Quotation[0].taskId;

    let productDetailsObj = QuotationData.productDetails ? { ...QuotationData.productDetails } : {};

    const updatedProducts = tableRef.current ? tableRef.current.getQuotationDetails() : [];

    updatedProducts.forEach((prod) => {
      if (productDetailsObj[prod.productIdentifier]) {
        productDetailsObj[prod.productIdentifier].discountPercent = prod.discountPercent;
      }
    });

    const updatedQuotationData = {
      updatedOn: new Date().toISOString(),
      discountPercent: discountPercentage,
      vatPercent: vatPercentage,
      productDetails: productDetailsObj,
      quotationComment:
        data.quotationComment.trim() === "" ? "n/a" : data.quotationComment,
    };

    const finalData = {
      ...QuotationData, 
      ...updatedQuotationData, 
    };
    console.log("Final Data:", finalData);

    try {
      await invokeQuotation(finalData, taskId);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error starting the process:", error);
    }
  };


  return (
    <>
      <div className="flex justify-center mb-2">
        <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
          Quotation
        </Button>
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Quotation</DialogTitle>
            </DialogHeader>

            <QuotationProductDataTable ref={tableRef} productIdentifierWiseDataObj={productIdentifierWiseDataObj} currency={currency}/>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="rounded-lg">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center">
                      <label>Discount (%):</label>
                      <FormInput
                        formControl={form.control}
                        type="number"
                        name="discountPercentage"
                        className="border rounded p-2 text-right"
                        min="0"
                        max="100"
                        value={discountPercentage}
                        onChange={(e) => handleDiscountChange(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex justify-between">
                      <label>Discounted Billing Amount (USD):</label>
                      <span>{discountedBillingAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <label>Billing Amount (USD):</label>
                      <span>{finalBillingAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <label>VAT Rate (%):</label>
                      <FormInput
                        formControl={form.control}
                        type="number"
                        name="vatPercentage"
                        className="border rounded p-2 text-right"
                        min="0"
                        max="100"
                        value={vatPercentage}
                        onChange={(e) => handleVatChange(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex justify-between">
                      <label>Final Billing Amount (USD):</label>
                      <span>USD {finalBillingAmountIncludingVAT.toFixed(2)}</span>
                    </div>

                    <div>
                      <FormTextarea
                        formControl={form.control}
                        label="Comments"
                        name="quotationComment"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Form>

            <DialogFooter>
              <TextButton onClick={form.handleSubmit(onSubmit)}>Submit</TextButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default QuotationButtonAndModal;
