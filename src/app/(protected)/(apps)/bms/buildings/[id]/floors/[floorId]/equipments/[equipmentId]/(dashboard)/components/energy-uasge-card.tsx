import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { Zap } from 'lucide-react';
import { energyUsageLiveDatafunction } from './liveData';

const EnergyUsageCard = () => {
  const [loading, setLoading] = useState(true);
  const [energyUsage, setEnergyUsage] = useState<number>();
  const [changePercent, setChangePercent] = useState<number>();

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setLoading(true); // Start loading before fetching
        const liveData = await energyUsageLiveDatafunction();

        if (
          Array.isArray(liveData) &&
          liveData.length > 0 &&
          liveData[0]?.monitoring_data != null
        ) {
          const parsedData = parseFloat(liveData[0].monitoring_data).toFixed(2);
          setEnergyUsage(Number(parsedData));
          // setChangePercent(liveData.changePercent); // If available
        } else {
          console.warn('Unexpected data format in liveData:', liveData);
        }
      } catch (error) {
        console.error('Error fetching live data:', error);
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };

    fetchLiveData(); // Initial fetch

    const intervalId = setInterval(fetchLiveData, 60000); // Fetch every minute

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
        <Zap className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-24 mb-2 bg-gray-400" />
            <Skeleton className="h-4 w-32 bg-gray-400" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{energyUsage} kW</div>
            <p className="text-xs text-muted-foreground">
              {changePercent != null
                ? `${changePercent > 0 ? '+' : ''}${changePercent}% from yesterday`
                : 'No comparison data'}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyUsageCard;
