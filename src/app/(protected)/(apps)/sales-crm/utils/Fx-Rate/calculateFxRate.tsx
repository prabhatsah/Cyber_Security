import { format } from "date-fns";
import { fxRateMap } from "./fxRateMap";

export const calculateFxRate = async ( selectedCurrency: string, baseCurrency: string): Promise<number> => {
    try {
        const fxRateData = await fxRateMap();
        console.log("calculateFxRate");
        const currentYear = format(new Date(), "yyyy");

        // Validate currency input
        if (!baseCurrency || !selectedCurrency) {
            return 1;
        }

        // Retrieve exchange rates for the current year
        const yearlyFxRates = fxRateData[currentYear] || {};
        
        let baseCurrencyFxRate = 0;
        let selectedFxRate = 0;

        // Find FX rates for the given currencies
        for (const id in yearlyFxRates) {
            const fxRateEntry = yearlyFxRates[id];
            if (fxRateEntry.currency === baseCurrency) {
                baseCurrencyFxRate = fxRateEntry.fxRate;
            }
            if (fxRateEntry.currency === selectedCurrency) {
                selectedFxRate = fxRateEntry.fxRate;
            }
        }

        // If base currency rate is 0, return 0 to avoid division by zero
        return baseCurrencyFxRate === 0 ? 0 : selectedFxRate / baseCurrencyFxRate;
    } catch (error) {
        console.error("Error calculating FX rate:", error);
        return 0;
    }
};
