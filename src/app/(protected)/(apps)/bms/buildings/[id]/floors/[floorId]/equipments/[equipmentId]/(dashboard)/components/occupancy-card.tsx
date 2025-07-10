import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { Battery } from 'lucide-react';


const OccupancyCard = () => {
  const [loading, setLoading] = useState(true);
  const [occupancy, setOccupancy] = useState<number>(42); // Simulated value
  const [changePercent, setChangePercent] = useState<number>(10); // Simulated change

  useEffect(() => {
    // Simulate loading delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5s shimmer

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <>
              <Skeleton className="h-8 w-20 mb-2 bg-gray-400" />
              <Skeleton className="h-4 w-32 bg-gray-400" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{occupancy}%</div>
              <p className="text-xs text-muted-foreground">
                +{changePercent}% from yesterday
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OccupancyCard;
