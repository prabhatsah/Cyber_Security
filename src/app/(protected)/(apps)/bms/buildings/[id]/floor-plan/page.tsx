import { FloorPlanViewer } from '../../../components/floor-plan/floor-plan-viewer'


export default function FloorPlanPage({ params }: { params: { id: string } }) {
  return (
    <>
      <FloorPlanViewer />
    </>
  )
}