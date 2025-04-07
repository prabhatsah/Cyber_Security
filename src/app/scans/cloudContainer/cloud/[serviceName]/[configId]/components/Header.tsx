import ChartWidget from './ChartWidget';
import BasicInfo from './BasicInfo';

export default function Header({ summary, scanTime, serviceNameAsDisplayStr, serviceCode, projectId }: {
    summary: Record<string, {
        checked_items: number;
        flagged_items: number;
        max_level: string;
        resources_count: number;
        rules_count: number;
    }>;
    scanTime: string;
    serviceNameAsDisplayStr: string;
    serviceCode: string;
    projectId?: string;
}) {
    return (
        <>
            <div className="grid grid-cols-4 gap-5 mt-3">
                <ChartWidget summary={summary} />
                <BasicInfo summary={summary} scanTime={scanTime} serviceNameAsDisplayStr={serviceNameAsDisplayStr} serviceCode={serviceCode} projectId={projectId} />
            </div>
        </>
    );
}