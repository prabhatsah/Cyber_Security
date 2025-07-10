"use client"

import { Bell } from "lucide-react"
import { Button } from "@/shadcn/ui/button"
import AciveAlarms from "./components/active-alarm"
import { CreateNotificationModal } from "./components/modal-form/createNotificatonModal"
import { CreateExpressionModal } from "./components/modal-form/createExpressionModal"
import { CreateConditionModal } from "./components/modal-form/createConditionModal"
import { ExpressionAlert } from "./components/modal-form/expressionAlert"
import { useAlarms } from "./context/alarmsContext"

export default function AlarmsPage() {
  const {
    createAlert,
    setCreateAlert,
    createQuery,
    setCreateQuery,
    createCondition,
    setCreateCondition,
    expressionCreated,
    setExpressionCreated,
    editData,
    setEditData,
    setViewMode,
    setExpressionInfo,
    setConditionInfo,
    setEditConditionData,
    setEditAlertData
  } = useAlarms();

  function resetState() {
    setCreateAlert(false);
    setViewMode(false);
    setExpressionInfo([]);
    setConditionInfo([]);
    setEditConditionData(null);
    setEditAlertData(null);
    setEditData(null);
  }
  function resetExpressionState() {
    setCreateQuery(false)
    setEditData(null);
  }
  function resetConditionState() {
    setCreateCondition(false);
    setEditConditionData(null);
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alarms & Events</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          <span>Test Alarm</span>
        </Button>
      </div>
      <AciveAlarms />
      {/* <CreateNotificationModal open={createAlert} onClose={() => { setCreateAlert(false), setViewMode(false) }} /> */}
      <CreateNotificationModal open={createAlert} onClose={() => { resetState() }} />
      <CreateExpressionModal open={createQuery} onClose={() => resetExpressionState()} defaultValues={editData} />
      <CreateConditionModal open={createCondition} onClose={() => resetConditionState()} />
      <ExpressionAlert open={expressionCreated} onClose={() => setExpressionCreated(false)} />
    </div>
  )
}