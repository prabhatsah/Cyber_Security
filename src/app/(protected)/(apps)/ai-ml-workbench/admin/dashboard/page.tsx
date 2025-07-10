import ServerDashboardDataTable from "./components/server-dashboard-datatable";
import WorkInProgressCard from "./components/work-in-progress-card";
import ProbeDashboardDataTable from "./components/probe-dashboard-datatable";
import DashboardCardHeader from "./components/dashboard-card-header";
import { Card, CardContent } from "@/shadcn/ui/card";
import CreateServerButtonWithModal from "../management/ml-servers/components/create-server";
import CreateProbeButtonWithModal from "../management/probes/components/create-probe";

export default function MLDashboard() {
  return (
    <>
      <div className="grid gap-3 grid-rows-2 h-full">
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-primary flex items-end p-3 rounded-lg">
            <div>
              <span>AI-ML Workbench</span>
              <br />
              <span className="text-xl font-medium" id="useraccess">
                Admin
              </span>
            </div>
          </Card>

          <Card className="border rounded-lg border-slate-100 overflow-auto">
            <DashboardCardHeader
              mainHeaderId="mlServerHeading"
              mainHeaderText="Machine Learning Servers"
              viewAllHref="/ai-ml-workbench/admin/management/ml-servers/"
              formOpenModal={<CreateServerButtonWithModal />}
            />

            <CardContent>
              <ServerDashboardDataTable />
            </CardContent>
          </Card>

          <WorkInProgressCard />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="border rounded-lg border-slate-100 overflow-auto">
            <DashboardCardHeader
              mainHeaderId="probeDetailsHeading"
              mainHeaderText="Probe Details"
              viewAllHref="/ai-ml-workbench/admin/management/probes/"
              formOpenModal={<CreateProbeButtonWithModal />}
            >
              <span>More than 400+ new probes</span>
            </DashboardCardHeader>

            <CardContent>
              <ProbeDashboardDataTable />
            </CardContent>
          </Card>

          <WorkInProgressCard />
        </div>
      </div>
    </>
  );
}
