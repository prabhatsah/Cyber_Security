
import { getProfileData } from "@/ikon/utils/actions/auth";
import Calendar from "./components/calender";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { BigCalendarEventProps } from "@/ikon/components/big-calendar/type";

export default async function page() {

    const currentUserId = (await getProfileData())?.USER_ID;

    const eventDataInstances = await getMyInstancesV2<any>({
        processName: "Event Creation Process",
        predefinedFilters: { taskName: "Event_View" },
        mongoWhereClause: `this.Data.Created_User == "${currentUserId}"`,

    });


    const eventData: BigCalendarEventProps[] = []
    if (eventDataInstances) {
        for (let i = 0; i < eventDataInstances.length; i++) {
            if (eventDataInstances[i]?.data.End_Date === undefined) {
                const obj = {
                    id: eventDataInstances[i]?.data.Id,
                    title: eventDataInstances[i]?.data.Title,
                    start: new Date(eventDataInstances[i]?.data.Start_Date),
                    end: new Date(eventDataInstances[i]?.data.Start_Date),
                    allDay: false,
                    is: true,
                    isView: true,
                    decription: eventDataInstances[i]?.data.Description,
                }
                eventData.push(obj)
            }
            else if (eventDataInstances[i]?.data.Repeat === "daily") {
                var date = new Date(eventDataInstances[i]?.data.Start_Date);
                console.log("date", date)
                while (date <= new Date(eventDataInstances[i]?.data.End_Date)) {

                    const obj = {
                        id: eventDataInstances[i]?.data.Id,
                        title: eventDataInstances[i]?.data.Title,
                        start: new Date(date),
                        end: new Date(date),
                        allDay: false,
                        isEdit: true,
                        isView: true,
                        decription: eventDataInstances[i]?.data.Description,
                    }
                    console.log("obj - " + obj)
                    eventData.push(obj)
                    date.setDate(date.getDate() + 1)
                }
            }
            else if (eventDataInstances[i]?.data.Repeat === "weekly") {
                var date = new Date(eventDataInstances[i]?.data.Start_Date);

                while (date <= new Date(eventDataInstances[i]?.data.End_Date)) {
                    console.log("date", date)
                    const obj = {
                        id: eventDataInstances[i]?.data.Id,
                        title: eventDataInstances[i]?.data.Title,
                        start: new Date(date),
                        end: new Date(date),
                        allDay: false,
                        isEdit: true,
                        isView: true,
                        decription: eventDataInstances[i]?.data.Description,
                    }
                    eventData.push(obj)
                    date.setDate(date.getDate() + 7)
                }
            }
            else if (eventDataInstances[i]?.data.Repeat === "monthly") {
                var date = new Date(eventDataInstances[i]?.data.Start_Date);
                while (date <= new Date(eventDataInstances[i]?.data.End_Date)) {
                    console.log("date", date)
                    const obj = {
                        id: eventDataInstances[i]?.data.Id,
                        title: eventDataInstances[i]?.data.Title,
                        start: new Date(date),
                        end: new Date(date),
                        allDay: false,
                        isEdit: true,
                        isView: true,
                        decription: eventDataInstances[i]?.data.Description,
                    }
                    eventData.push(obj)
                    date.setMonth(date.getMonth() + 1)
                }
            }
        }
    }


    return (
        <>
            <Calendar events={eventData} />
        </>
    );
}
