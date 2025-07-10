import { FloorOverview } from '../../../components/dashboard/floor-overview'


export default function FloorsPage({ params }: { params: { id: string } }) {
  return (
    <>
      <FloorOverview />
    </>
  )
}