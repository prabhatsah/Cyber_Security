import { Thermometer } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Skeleton } from "@/shadcn/ui/skeleton"; // <- Import Skeleton

import { DailyMeanCalculator } from '@/app/(protected)/(apps)/bms/streaming-average/get-streaming-avarage';
import { getData } from '@/app/(protected)/(apps)/bms/get-data/get-cassandra-data';

const param = {
  dataCount: 1,
  service_name: null,
  serviceNameList: ['AHU-01 RA Temp'],
  startDate: null,
  endDate: null,
  timePeriod: null,
};

const TemperatureCard = () => {
  const [result, setResult] = useState<{ currentMean: number; previousDayMean: number }>({ currentMean: 0, previousDayMean: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const dailyMeanCalculator = new DailyMeanCalculator();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const getDataFromCassendra = await getData(param);
        const tempData = getDataFromCassendra;

        if (tempData && tempData.length > 0) {
          const dataForToday = Number.parseFloat(tempData[0]?.monitoring_data || 0);

          dailyMeanCalculator.push(dataForToday);

          const currentMean = dailyMeanCalculator.getMean();
          const previousDayMean = dailyMeanCalculator.getPreviousDayMean();

          setResult({
            currentMean: currentMean ?? 0,
            previousDayMean: previousDayMean ? previousDayMean : 25,
          });
        }
      } catch (error) {
        setError('Error fetching temperature data');
        console.error('Error fetching temperature data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setTrigger(prev => prev + 1);
    }, 60 * 1000); // 60 seconds

    return () => clearInterval(interval);

  }, [trigger]);

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-xs">{error}</p>}

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-24 rounded bg-gray-400" />
              <Skeleton className="h-4 w-32 rounded bg-gray-400" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {result.currentMean.toFixed(2)}°C
              </div>
              <p className="text-xs text-muted-foreground">
                {(result.currentMean - result.previousDayMean).toFixed(2)}°C from yesterday
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemperatureCard;
