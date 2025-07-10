import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { EventData } from "@/app/(protected)/examples/calendar/type";
import { getProfileData } from "@/ikon/utils/actions/auth";
import DealEvent from "./eventCalender";

export default async function DealEventTab({ params }: { params: { id: string } }) {
  const dealIdentifier = params.id;
  const profileData = await getProfileData();
  const userId = profileData.USER_ID;

  const eventData: EventData[] = [];

  try {
    const eventDataInstances = await getMyInstancesV2<any>({
      processName: "Event Creation Process",
      predefinedFilters: { taskName: "Event_View" },
      mongoWhereClause: `this.Data.Created_User == "${userId}" && this.Data.dealsParentId == "${dealIdentifier}"`,
    });

    for (let instance of eventDataInstances) {
      const data = instance.data;
      if (!data.End_Date) {
        eventData.push({
          id: data.Id,
          title: data.Title,
          start: new Date(data.Start_Date),
          end: new Date(data.Start_Date),
          allDay: false,
          isEdit: true,
          isView: true,
          description: data.Description,
        });
      } else if (data.Repeat === "daily") {
        let date = new Date(data.Start_Date);
        while (date <= new Date(data.End_Date)) {
          eventData.push({
            id: data.Id,
            title: data.Title,
            start: new Date(date),
            end: new Date(date),
            allDay: false,
            isEdit: true,
            isView: true,
            description: data.Description,
          });
          date.setDate(date.getDate() + 1);
        }
      } else if (data.Repeat === "weekly") {
        let date = new Date(data.Start_Date);
        while (date <= new Date(data.End_Date)) {
          eventData.push({
            id: data.Id,
            title: data.Title,
            start: new Date(date),
            end: new Date(date),
            allDay: false,
            isEdit: true,
            isView: true,
            description: data.Description,
          });
          date.setDate(date.getDate() + 7);
        }
      } else if (data.Repeat === "monthly") {
        let date = new Date(data.Start_Date);
        while (date <= new Date(data.End_Date)) {
          eventData.push({
            id: data.Id,
            title: data.Title,
            start: new Date(date),
            end: new Date(date),
            allDay: false,
            isEdit: true,
            isView: true,
            description: data.Description,
          });
          date.setMonth(date.getMonth() + 1);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
  }

  return (
    <>
      <DealEvent dealIdentifier={dealIdentifier} eventData={eventData} />
    </>
  );
}
