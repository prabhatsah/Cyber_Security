"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Form } from "@/shadcn/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FXRateSchema } from "../fx-rate-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import { countryCodeCurrencyJSON } from "../fx-rate-schema/countryCode";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { saveFXRateData } from "../fx-rate-invoke";

interface EditFXRateDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFX?: {} | any;
}

interface YearData {
  id: number;
  currency: string;
  fxRate: number;
  activeStatus: boolean;
  year: string;
}

const EditFXModal: React.FC<EditFXRateDetailsProps> = ({
  isOpen,
  onClose,
  selectedFX = {},
}) => {
  const [years, setYears] = useState<{ value: string; label: string }[]>([]);
  const [countryCurrencyItems, setCountryCurrencyItems] = useState<
    { value: string; label: string; countryName?: string; id: number }[]
  >([]);
  const router = useRouter();
  const [fxRates, setFxRates] = useState<Record<string, Record<string, any>>>();

  const [selectedFXData, setSelectedFXData] = useState<YearData | null>(null);
  const [isNewFXRate, setIsNewFXRate] = useState(true);
  const [isCopyFXRate, setIsCopyFXRate] = useState(false);
  const [hasSelectedFX, setHasSelectedFX] = useState(false);
  const [yearOptions, setYearOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedCopyYear, setSelectedCopyYear] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FXRateSchema>>({
    resolver: zodResolver(FXRateSchema),
    defaultValues: {
      currency: selectedFX?.currency || "",
      year: selectedFX?.year || "",
      fxRate: selectedFX?.fxRate ? String(selectedFX.fxRate) : "",
    },
  });

  useEffect(() => {
    setSelectedFXData(selectedFX);
    form.reset({
      currency: selectedFX?.currency || "",
      year: selectedFX?.year || "",
      fxRate: selectedFX?.fxRate ? String(selectedFX.fxRate) : "",
    });

    if (selectedFX && Object.keys(selectedFX).length > 0) {
      setHasSelectedFX(true);
      setIsNewFXRate(true);
      setIsCopyFXRate(false);
    } else {
      setHasSelectedFX(false);
      setIsCopyFXRate(false);
    }
  }, [selectedFX, form]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 2;

    const yearOptions = Array.from({ length: futureYear - 2019 }, (_, i) => ({
      value: `${2020 + i}`,
      label: `${2020 + i}`,
    }));
    setYears(yearOptions);
  }, []);

  useEffect(() => {
    loadAndShowCurrencies();
  }, []);

  const prevFxCurrencyMap = new Map<string, { id: number }>();
  const idSet = new Set<number>();

  const loadAndShowCurrencies = () => {
    const countryNameCurrencyMap: Record<
      string,
      { countryName: string; id?: number }
    > = {};

    for (const [country, currencyObj] of Object.entries(
      countryCodeCurrencyJSON
    )) {
      countryNameCurrencyMap[currencyObj.currency] = { countryName: country };
    }

    let id = 1;
    const updatedCurrencyList = Object.entries(countryNameCurrencyMap).map(
      ([currency, data]) => {
        let assignedId: number;
        let alreadyAdded = false;

        if (prevFxCurrencyMap.has(currency)) {
          assignedId = prevFxCurrencyMap.get(currency)!.id;
          alreadyAdded = true;
        } else {
          while (idSet.has(id)) {
            id++;
          }
          assignedId = id;
          idSet.add(id);
        }

        return {
          value: currency,
          label: currency,
          countryName: data.countryName,
          id: assignedId,
        };
      }
    );
    console.log("Updated Currency List: ", updatedCurrencyList);
    setCountryCurrencyItems(updatedCurrencyList);
  };

  const fetchfxRateTableData = async () => {
    try {
      const fxRateInstances = await getMyInstancesV2({
        processName: "Fx Rate",
        predefinedFilters: { taskName: "View State" },
      });
      let fxRatesAllData = fxRateInstances[0]?.data?.fxRates;
      console.log("Fx rates ", fxRatesAllData);
      const yearsArray = Object.keys(fxRatesAllData);
      const formattedYears = yearsArray.map((year) => ({
        value: year,
        label: year,
      }));
      console.log("Fx rates yeras ", formattedYears);
      setYearOptions(formattedYears);
      setFxRates(fxRatesAllData);
    } catch (error) {
      console.error("Error fetching FX rates:", error);
    }
  };

  useEffect(() => {
    fetchfxRateTableData();
  }, []);

  function handleNewFXRateChange(checked: boolean) {
    setIsNewFXRate(checked);
    if (checked) {
      setIsCopyFXRate(false);
    }
  }

  function handleCopyFXRateChange(checked: boolean) {
    setIsCopyFXRate(checked);
    if (checked) {
      setIsNewFXRate(false);
    }
  }

  async function handleOnSubmit(data: z.infer<typeof FXRateSchema>) {
    console.log("Saving FX Rate Data:", data);
    console.log("Fx rate data before update: ", fxRates);

    if (isNewFXRate == true) {
      const currency = data.currency;
      const year = data.year;
      const fxRate = Number(data.fxRate);

      const foundItem = countryCurrencyItems.find(
        (item) => item.value === currency
      );
      const id = foundItem?.id?.toString();

      if (!id) {
        console.error("Invalid currency ID");
        return;
      }

      let updatedFxRates = fxRates ? { ...fxRates } : {};

      if (!updatedFxRates[year]) {
        updatedFxRates[year] = {};
      }

      updatedFxRates[year][id] = {
        id: id,
        currency: currency,
        fxRate: fxRate,
        activeStatus: true,
        year: year,
      };

      console.log("Updated FX Rate Data:", updatedFxRates);
      await saveFXRateData(updatedFxRates);
    } else {
      if (!selectedCopyYear || !fxRates[selectedCopyYear]) {
        console.error(
          "No valid year selected for copying or no data available for the selected year"
        );
        return;
      }

      console.log("Copied data: ", fxRates[selectedCopyYear]);
      console.log("Previously selected year: ", selectedCopyYear);

      let updatedFxRates = fxRates ? { ...fxRates } : {};

      updatedFxRates[data.year] = { ...fxRates[selectedCopyYear] };

      console.log("Updated FX Rate Data after copying:", updatedFxRates);
      await saveFXRateData(updatedFxRates);
    }

    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>FX Rate</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            {!hasSelectedFX && (
              <div className="grid grid-cols-3 gap-4" id="deal_checkbox">
                <div className="grid gap-1.5">
                  <div className="flex items-center">
                    <Checkbox
                      id="newDeal"
                      checked={isNewFXRate}
                      onCheckedChange={handleNewFXRateChange}
                    />
                    <label
                      htmlFor="newDeal"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      New FX Rate
                    </label>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center">
                    <Checkbox
                      id="copyFxRate"
                      checked={isCopyFXRate}
                      onCheckedChange={handleCopyFXRateChange}
                    />
                    <label
                      htmlFor="copyFxRate"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Copy From Previous FX Rate
                    </label>
                  </div>
                </div>
              </div>
            )}

            {isCopyFXRate && (
              <div className="grid gap-1.5" id="copyFxRateId">
                <div className="mt-4">
                  <FormComboboxInput
                    items={yearOptions}
                    formControl={form.control}
                    name={"copyYear"}
                    placeholder={"Copy from Previous FX Rate"}
                    onSelect={(value) => setSelectedCopyYear(value)}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-1.5">
              <FormComboboxInput
                items={years}
                formControl={form.control}
                name={"year"}
                label="Select Year *"
                placeholder={"Choose Year"}
              />
            </div>

            {isNewFXRate && (
              <div className="grid gap-1.5">
                <FormComboboxInput
                  items={countryCurrencyItems}
                  formControl={form.control}
                  name={"currency"}
                  label="Select Currency *"
                  placeholder={"Choose Currency"}
                />
              </div>
            )}

            {isNewFXRate && (
              <div className="grid gap-1.5">
                <FormInput
                  formControl={form.control}
                  name={"fxRate"}
                  label="FX Rate *"
                  placeholder="Enter FX Rate"
                />
              </div>
            )}

            {/* Submit Button */}
            <DialogFooter className="flex justify-end mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFXModal;
