import React, { useState, useEffect } from 'react';
import { DailyMeanCalculator } from '@/app/(protected)/(apps)/bms/streaming-average/get-streaming-avarage';
import { getData } from '@/app/(protected)/(apps)/bms/get-data/get-cassandra-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { Droplets } from 'lucide-react';

const paramHumid = {
  dataCount: 1,
  service_name: null,
  serviceNameList: ['RA Humid'],
  startDate: null,
  endDate: null,
  timePeriod: null,
};

const HumidityCard = () => {
  const [resultHumid, setResultHumid] = useState<{ currentMean: number; previousDayMean: number }>({
    currentMean: 0,
    previousDayMean: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  const dailyMeanCalculator = new DailyMeanCalculator();

  useEffect(() => {
    const fetchDataHumid = async () => {
      try {
        setLoading(true); // Start shimmer
        const getDataFromCassendra = await getData(paramHumid);
        const humidData = getDataFromCassendra;

        if (humidData && humidData.length > 0) {
          const humidDataForToday = Number.parseFloat(humidData[0]?.monitoring_data || 0);
          dailyMeanCalculator.push(humidDataForToday);

          const currentMean = dailyMeanCalculator.getMean();
          const previousDayMean = dailyMeanCalculator.getPreviousDayMean();

          setResultHumid({
            currentMean: currentMean ?? 0,
            previousDayMean: previousDayMean ? previousDayMean : 40,
          });
        }
      } catch (error) {
        setError('Error fetching humidity data');
        console.error('Error fetching humidity data:', error);
      } finally {
        setLoading(false); // Stop shimmer
      }
    };

    fetchDataHumid();

    const interval = setInterval(() => {
      setTrigger((prev) => prev + 1);
    }, 60 * 1000); // Every 60 seconds

    return () => clearInterval(interval);
  }, [trigger]);

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Humidity</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-xs">{error}</p>}

          {loading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2 bg-gray-400" />
              <Skeleton className="h-4 w-40 bg-gray-400" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{resultHumid.currentMean.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">
                {(resultHumid.currentMean - resultHumid.previousDayMean).toFixed(2)}% from yesterday
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HumidityCard;
