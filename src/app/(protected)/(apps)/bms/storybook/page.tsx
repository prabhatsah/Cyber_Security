import React from 'react';
import GanttChart from '@/ikon/components/charts/gantt-chart';
const StorybookPage: React.FC = () => {
    return (
        <div>
            <GanttChart chartData={[]} configurationObj={{ key: 'value' }}/>
        </div>
    );
};

export default StorybookPage;