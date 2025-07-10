"use client";

import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Calendar } from "@/shadcn/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
//import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/shadcn/ui/label";
//import ComboboxInput from "@/ikon/components/combobox-input";
import MultiCombobox from "@/ikon/components/multi-combobox";
import ComboboxInput from "@/ikon/components/combobox-input";
//import ComboboxInput from "@/ikon/components/combobox-input";

import { v4 as uuid } from "uuid";
import { CommandIdWiseSchedule, CommandScheduleType } from "../../../types";
import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
//import { getFormattedDate } from "../../../utils/helper";

type ScheduleType = "Once" | "Daily" | "Weekly" | "Monthly";

type ParamsType = {
  selectedCommandId : string;
  deviceList : {
    hostIp : string;
    deviceId : string;
  }[],
  savedScheduledInfo : RefObject<{
    [key: string]: CommandScheduleType;
  } | null>,
  existingCommandSchedulingData : CommandIdWiseSchedule | null;
}

// const generateQuartzCron = function (
//   date: Date | undefined,
//   time: string,
//   recurrence: 'once' | 'daily' | 'monthly' | 'weekly' = 'once'
// ): string {
//   const [hour, minute] = time.split(':').map(Number);
//   const day = date ? date.getDate() : '';
//   const month = date ? date.getMonth() + 1 : '';
//   const weekday = date ? date.getDay() : ''; // 0 (Sun) - 6 (Sat)

//   switch (recurrence) {
//     case 'daily':
//       return `0 ${minute} ${hour} * * ?`; // ? for "no specific day of week"
//     case 'monthly':
//       return `0 ${minute} ${hour} ${day} * ?`;
//     case 'weekly':
//       return `0 ${minute} ${hour} ? * ${weekday}`;
//     case 'once':
//     default:
//       return `0 ${minute} ${hour} ${day} ${month} ?`; // one-time
//   }
// }

// const generateQuartzCron = function (
//   date: Date | undefined,
//   time: string,
//   recurrence: 'once' | 'daily' | 'monthly' | 'weekly' = 'once'
// ): string {
//   const [hour, minute] = time.split(':').map(Number);

//   const quartzWeekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

//   switch (recurrence) {
//     case 'daily':
//       return `0 ${minute} ${hour} * * ? *`; // daily at time

//     case 'monthly':
//       if (!date) return '';
//       return `0 ${minute} ${hour} ${date.getDate()} * ? *`;

//     case 'weekly':
//       if (!date) return '';
//       return `0 ${minute} ${hour} ? * ${quartzWeekdays[date.getDay()]} *`;

//     case 'once':
//     default:
//       if (!date) return '';
//       return `0 ${minute} ${hour} ${date.getDate()} ${date.getMonth() + 1} ? *`;
//   }
// };

const generateQuartzCron = function (
  date: Date | undefined,
  time: string,
  recurrence: 'once' | 'daily' | 'monthly' | 'weekly' = 'once',
  selectedDays: string[] = [],
  selectedMonths: string[] = [],
  selectedDay: number[] = [],
  selectedWeek: string = '',
  selectedDayOfWeek: string[] = [],
  useDaysOption: boolean = true
): string {
  const [hour, minute] = time.split(':').map(Number);

  const day = date?.getDate();
  const month = date?.getMonth() != null ? date.getMonth() + 1 : null;
  const quartzWeekdaysMap: Record<string, string> = {
    sunday: 'SUN',
    monday: 'MON',
    tuesday: 'TUE',
    wednesday: 'WED',
    thursday: 'THU',
    friday: 'FRI',
    saturday: 'SAT'
  };

  const quartzMonthMap: Record<string, string> = {
    january: '1',
    february: '2',
    march: '3',
    april: '4',
    may: '5',
    june: '6',
    july: '7',
    august: '8',
    september: '9',
    october: '10',
    november: '11',
    december: '12'
  };

  const quartzWeekMap: Record<string, string> = {
    first: '#1',
    second: '#2',
    third: '#3',
    fourth: '#4',
    last: 'L'
  };

  const quartzDayOfWeek: Record<string, string> = {
    sunday: '1',
    monday: '2',
    tuesday: '3',
    wednesday: '4',
    thursday: '5',
    friday: '6',
    saturday: '7'
  }

  switch (recurrence) {
    case 'daily':
      return `0 ${minute} ${hour} * * ? *`;

    case 'monthly':
      if (selectedMonths.length === 0) return '';

      if(useDaysOption){
        const monthsCode = selectedMonths.map(month => quartzMonthMap[month.toLowerCase()]).filter(Boolean).join(',');
        const dayCode = selectedDay.join(',')
      
        return `0 ${minute} ${hour} ${dayCode} ${monthsCode} ? *`;
      }
      else{
        const monthsCode = selectedMonths.map(month => quartzMonthMap[month.toLowerCase()]).filter(Boolean).join(',');
        const week = quartzWeekMap[selectedWeek];

        const selectedDayOfWeekFormatted = selectedDayOfWeek.map(dayofweek => quartzDayOfWeek[dayofweek]+week)

        const dayOfWeek = selectedDayOfWeekFormatted.join(',')

        return `0 ${minute} ${hour} ? ${monthsCode} ${dayOfWeek} *`;
      }

      // else {
      //   const monthsCode = selectedMonths
      //     .map(month => quartzMonthMap[month.toLowerCase()])
      //     .filter(Boolean)
      //     .join(',');
      
      //   const week = quartzWeekMap[selectedWeek];
      
      //   const dayOfWeekCrons = selectedDayOfWeek
      //     .map(day => {
      //       const dayCode = quartzDayOfWeek[day.toLowerCase()];
      //       return `0 ${minute} ${hour} ? ${monthsCode} ${dayCode}${week} *`;
      //     });
      
      //   // If only one cron expression, return it as string
      //   // If multiple, you can return an array or handle differently
      //   return dayOfWeekCrons.length === 1 ? dayOfWeekCrons[0] : JSON.stringify(dayOfWeekCrons);
      // }


    case 'weekly':
      if (selectedDays.length === 0) return '';
      const days = selectedDays
        .map(day => quartzWeekdaysMap[day.toLowerCase()])
        .filter(Boolean)
        .join(',');
      return `0 ${minute} ${hour} ? * ${days} *`;

    case 'once':
    default:
      if (day == null || month == null) return '';
      return `0 ${minute} ${hour} ${day} ${month} ? *`;
  }
};



const populateSchedulingData = (
  schedulingData: CommandIdWiseSchedule | null,
  commandId: string,
  setDate: Dispatch<SetStateAction<Date | undefined>>,
  setTime: Dispatch<SetStateAction<string | undefined>>,
  setRepetition: Dispatch<SetStateAction<string | undefined>>,
  setSelectedDays: Dispatch<SetStateAction<string[]>>,
  setSelectedMonths: Dispatch<SetStateAction<string[]>>,
  setSelectedDay: Dispatch<SetStateAction<number[]>>
) => 
{

  if(!schedulingData) return;

  console.log('schedulingData: ', schedulingData);

  const prevScheduleData = schedulingData[commandId];

  const prevScheduleType = prevScheduleData.scheduleObj.scheduleConfig.type;

  const dateTime = prevScheduleData.scheduleObj.scheduleConfig.dateTime ? prevScheduleData.scheduleObj.scheduleConfig.dateTime : '';
  const timeVal = prevScheduleData.scheduleObj.scheduleConfig.timeVal;
  const dateTime_ = dateTime.split(' ');
  const date = dateTime_[0];
  const time = dateTime_[1];
  const confiData = prevScheduleData.scheduleObj.scheduleConfig;

  switch (prevScheduleType){
    case 'daily':
      setTime(timeVal);
      setRepetition(confiData.recurCount);
      break;

    case 'weekly':
      setTime(timeVal);
      setSelectedDays(confiData.dayList ? confiData.dayList : []);
      break;

    case 'monthly':
      const tt = confiData.cronExp.split(' ')[3];
      const rr = tt.split(',').map(obj=>parseInt(obj));

      setSelectedDay(rr);
      setTime(timeVal);
      setSelectedMonths(confiData.monthlyScheduleMonths ? confiData.monthlyScheduleMonths : []);

      break;
      
    default:
      setDate(new Date(date));
      setTime(time);
  }
}

const getServerDate = async (datetime: string) => {
  try{
    const data = await getMyInstancesV2({
      processName: 'Server DateTime'
    })
  
    const data1:{serverDateTime : string} = await getParameterizedDataForTaskId({
      taskId: data[0].taskId,
      parameters :  {'userDate': new Date(datetime).getTime()}
    })
  
    return data1['serverDateTime'];
  }
  catch(err){
    console.error(err)

    return null;
  }
  
}


export default function CommandConfigSchedule({open, close, params}: {open: boolean, close: (open: boolean) => void, params: ParamsType}) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("Once");
  const [date, setDate] = useState<Date>();
  const [showReminder, setShowReminder] = useState(false);
  const [time, setTime] = useState<string>();
  const [repetition, setRepetition] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [startReminder, setStartReminder] = useState<string>();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [useDaysOption, setUseDaysOption] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number[]>([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  let prevScheduleData: "daily" | "monthly" | "weekly" | "oneTime" | null = null;

  if(params.existingCommandSchedulingData){
    prevScheduleData = params.existingCommandSchedulingData[params.selectedCommandId].scheduleObj.scheduleConfig.type
  } 
  

  const onSave = async ()=>{
    if(scheduleType=='Once'){
      if(date && time){
        const date_ = new Date(date);
        const cron = generateQuartzCron(date, time, 'once');
        const commandId = params.selectedCommandId;

        const formatted = format(date_, 'yyyy-MM-dd');

        const saveData: CommandScheduleType = {
          configuredOn: new Date(),
          commandId: params.selectedCommandId,
          deviceList: params.deviceList,
          scheduleObj:{
            scheduleConfig: {
              cronExp: cron,
              dateTime: formatted + ' ' + time,
              type: 'oneTime' 
            },
            scheduleId: uuid()
          }
        }

        console.log('saved scheduled data: ', saveData);

        params.savedScheduledInfo.current = {
          [commandId] : saveData
        }

        close(false);
      }
      
    }else if(scheduleType == 'Daily'){
      if(repetition && time){
        const cron = generateQuartzCron(date, time, 'daily');
        const commandId = params.selectedCommandId;

        const saveData: CommandScheduleType = {
          configuredOn: new Date(),
          commandId: params.selectedCommandId,
          deviceList: params.deviceList,
          scheduleObj:{
            scheduleConfig: {
              cronExp: cron,
              recurCount: repetition,
              timeVal: time,
              type: 'daily' 
            },
            scheduleId: uuid()
          }
        }

        console.log('saved scheduled data: ', saveData);

        params.savedScheduledInfo.current = {
          [commandId] : saveData
        }

        close(false);
      }
    }else if(scheduleType == 'Weekly'){
      if(selectedDays.length && time){
        const cron = generateQuartzCron(date, time, 'weekly', selectedDays);
        const commandId = params.selectedCommandId;

        const saveData: CommandScheduleType = {
          configuredOn: new Date(),
          commandId: params.selectedCommandId,
          deviceList: params.deviceList,
          scheduleObj:{
            scheduleConfig: {
              cronExp: cron,
              dayList: selectedDays,
              timeVal: time,
              type: 'weekly' 
            },
            scheduleId: uuid()
          }
        }

        try{
          if(showReminder && repetition && duration && startReminder){
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const intervalMap:any = {
              "5m": 5 * 60 * 1000,
              "10m": 10 * 60 * 1000,
              "15m": 15 * 60 * 1000,
              "30m": 30 * 60 * 1000,
              "1h": 60 * 60 * 1000,
            };
  
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const durationMap:any = {
              "15 minutes": 15 * 60 * 1000,
              "30 minutes": 30 * 60 * 1000,
              "1 hour": 60 * 60 * 1000,
              "12 hours": 12 * 60 * 60 * 1000,
              "1 day": 24 * 60 * 60 * 1000,
              "Indefinitely": "Indefinitely",
            };
  
            
            const formatted = startReminder.replace('T', ' ');
            const serverDate = await getServerDate(formatted);
  
            const repeat = intervalMap[repetition];
            const duration_ = durationMap[duration];
            
            if(!serverDate){
              throw new Error('failed to fetch serverdate')
            }
  
            const [datePart, timePart] = serverDate.split(" ");
  
            const [year, month, day] = datePart.split("-");
  
            const [hours, minutes, seconds] = timePart.split(":");
  
            const quartzCron = `${seconds} ${minutes} ${hours} ${day} ${month} ? ${year}`;
  
            let repeatCount;
  
            if (duration_ === "Indefinitely") {
              repeatCount = "Indefinitely";
            } else {
              repeatCount = Math.floor(repeat / duration_);
            }
  
            saveData.scheduleObj.scheduleConfig.reminderDetails = {
              startReminder: formatted,
              reminderDuration: duration,
              interval: repeat,
              intervalUnit: 'Minutes',
              reminderStartCron: quartzCron,
              repeatCount: repeatCount
            }
          }
        }
        catch(err){
          console.error(err)
        }

        

        console.log('saved scheduled data: ', saveData);

        params.savedScheduledInfo.current = {
          [commandId] : saveData
        }

        close(false);
      }
    }else{
      if(selectedMonths.length && time){
        const cron = generateQuartzCron(date, time, 'monthly', [], selectedMonths, selectedDay, selectedWeek, selectedDayOfWeek, useDaysOption);
        const commandId = params.selectedCommandId;

        const saveData: CommandScheduleType = {
          configuredOn: new Date(),
          commandId: params.selectedCommandId,
          deviceList: params.deviceList,
          scheduleObj:{
            scheduleConfig: {
              cronExp: cron,
              monthlyScheduleMonths: selectedMonths,
              timeVal: time,
              type: 'monthly' 
            },
            scheduleId: uuid()
          }
        }
        try{
          if(showReminder && repetition && duration && startReminder){
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const intervalMap:any = {
              "5m": 5 * 60 * 1000,
              "10m": 10 * 60 * 1000,
              "15m": 15 * 60 * 1000,
              "30m": 30 * 60 * 1000,
              "1h": 60 * 60 * 1000,
            };
  
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const durationMap:any = {
              "15 minutes": 15 * 60 * 1000,
              "30 minutes": 30 * 60 * 1000,
              "1 hour": 60 * 60 * 1000,
              "12 hours": 12 * 60 * 60 * 1000,
              "1 day": 24 * 60 * 60 * 1000,
              "Indefinitely": "Indefinitely",
            };
  
            const formatted = startReminder.replace('T', ' ');
            const serverDate = await getServerDate(formatted);
  
            const repeat = intervalMap[repetition];
            const duration_ = durationMap[duration];
  
            if(!serverDate){
              throw new Error('failed to fetch serverdate')
            }
  
            const [datePart, timePart] = serverDate.split(" ");
  
            const [year, month, day] = datePart.split("-");
  
            const [hours, minutes, seconds] = timePart.split(":");
  
            const quartzCron = `${seconds} ${minutes} ${hours} ${day} ${month} ? ${year}`;
  
            let repeatCount;
  
            if (duration_ === "Indefinitely") {
              repeatCount = "Indefinitely";
            } else {
              repeatCount = Math.floor(repeat / duration_);
            }
  
            saveData.scheduleObj.scheduleConfig.reminderDetails = {
              startReminder: formatted,
              reminderDuration: duration,
              interval: repeat,
              intervalUnit: 'Minutes',
              reminderStartCron: quartzCron,
              repeatCount: repeatCount
            }
          }
        }
        catch(err){
          console.error(err)
        }

        

        console.log('saved scheduled data: ', saveData);

        params.savedScheduledInfo.current = {
          [commandId] : saveData
        }

        close(false);
      }
    }
  }

  const renderContent = () => {
    switch (scheduleType) {
      case "Monthly":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Starts From
              </label>
              <div className="mt-1.5 relative">
                <Input 
                  type="time"
                  className="flex-1"
                  defaultValue={prevScheduleData == 'monthly' ? time : ''}
                  onChange={(e) => setTime(e.target.value)}
                />
                <Clock color="#4e02c1" className="absolute left-[65px] top-[10px] h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">
                Monthly schedule months
              </label>
              <MultiCombobox 
                placeholder='select month'
                defaultValue={prevScheduleData == 'monthly' ? selectedMonths : []} 
                onValueChange={(val: string[])=>{setSelectedMonths(val)}} 
                items={
                   [
                    {value: 'january', label: 'January'},
                    {value: 'february', label: 'February'},
                    {value: 'march', label: 'March'},
                    {value: 'april', label: 'April'},
                    {value: 'may', label: 'May'},
                    {value: 'june', label: 'June'},
                    {value: 'july', label: 'July'},
                    {value: 'august', label: 'August'},
                    {value: 'september', label: 'September'},
                    {value: 'october', label: 'October'},
                    {value: 'november', label: 'November'},
                    {value: 'december', label: 'December'}
                  ]
                }/>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={useDaysOption}
                  onCheckedChange={(checked) => setUseDaysOption(checked as boolean)}
                  id="days-option"
                />
                <label htmlFor="days-option" className="text-sm font-medium">
                  Days:
                </label>
              </div>
              {useDaysOption && (
                <MultiCombobox 
                  placeholder='select day' 
                  defaultValue={prevScheduleData == 'monthly' ? selectedDay : []}
                  onValueChange={(val: number[])=>{setSelectedDay(val)}} 
                  items={
                    Array.from({length: 31}).map((_, index)=>{return {value: index+1, label: index+1}})
                  }
                />

              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!useDaysOption}
                  onCheckedChange={(checked) => setUseDaysOption(!checked as boolean)}
                  id="on-option"
                />
                <label htmlFor="on-option" className="text-sm font-medium">
                  On:
                </label>
              </div>
              {!useDaysOption && (
                <div className="flex space-x-2">
                  <ComboboxInput onSelect={(val)=>{setSelectedWeek(val as string)}}  items={[
                    {label: 'First', value: 'first'},
                    {label: 'Second', value: 'second'},
                    {label: 'Third', value: 'third'},
                    {label: 'Fourth', value: 'fourth'},
                    {label: 'Fifth', value: 'last'}
                  ]} />

                  <MultiCombobox 
                    placeholder='select day'
                    defaultValue={prevScheduleData == 'monthly' ? selectedDayOfWeek : []} 
                    onValueChange={(val: string[])=>{setSelectedDayOfWeek(val)}} 
                    items={[
                      {label: 'Monday', value: 'monday'},
                      {label: 'Tuesday', value: 'tuesday'},
                      {label: 'Wednesday', value: 'wednesday'},
                      {label: 'Thursday', value: 'thursday'},
                      {label: 'Friday', value: 'friday'},
                      {label: 'Saturday', value: 'saturday'},
                      {label: 'Sunday', value: 'sunday'}
                    ]} 
                  />
                </div>
              )}
            </div>
          </div>
        );
      case "Weekly":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Starts From
              </label>
              <div className="mt-1.5 relative">
                <Clock color="#4e02c1" className="absolute left-[65px] top-[10px] h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  type="time"
                  className="flex-1"
                  defaultValue={prevScheduleData == 'weekly' ? time : ''}
                  onChange={(e) => {setTime(e.target.value)}}
                />
              </div>
            </div>
            <div>
              <MultiCombobox defaultValue={prevScheduleData == 'weekly' ? selectedDays : []} onValueChange={(val: string[])=>{setSelectedDays(val)}} placeholder='select day' items={[
                {value: 'monday', label: 'Monday'},
                {value: 'tuesday', label: 'Tuesday'},
                {value: 'wednesday', label: 'Wednesday'},
                {value: 'thursday', label: 'Thursday'},
                {value: 'friday', label: 'Friday'},
                {value: 'saturday', label: 'Saturday'},
                {value: 'sunday', label: 'Sunday'}
              ]}/>
            </div>
          </div>
        );
      case "Daily":
        return (
          <div className="space-y-4">
            <div className="space-y-2">              
              <div className="relative space-y-2">
                <Label htmlFor="time_daily" className="text-sm font-medium">Starts From</Label>
                <div>
                  <Input id="time_daily" defaultValue={prevScheduleData == 'daily' ? time : ''} onChange={(e)=>{ setTime(e.target.value) }} type="time"/>
                  <Clock color="#4e02c1" className="absolute left-[65px] top-[42px] h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div> 
              <div className="space-y-2">
                <Label htmlFor="repitition_daily" className="text-sm font-medium">Repetitions</Label>
                <Input id="repitition_daily" defaultValue={prevScheduleData == 'daily' ? repetition : ''} onChange={(e)=>{ setRepetition(e.target.value) }} type="number" />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Starts From
            </label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={//cn(
                      "w-full justify-start text-left font-normal"
                      //,!date && "text-muted-foreground"
                    //)
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="relative">
                <Input onChange={(e)=>{ setTime(e.target.value) }} defaultValue={prevScheduleData == 'oneTime' ? time : ''} type="time"/>
                <Clock color="#4e02c1" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>  
              
            </div>

          </div>
        );
    }
  };

  useEffect(()=>{
    populateSchedulingData(params.existingCommandSchedulingData, params.selectedCommandId, setDate, setTime, setRepetition, setSelectedDays, setSelectedMonths, setSelectedDay)
  },[params.existingCommandSchedulingData, params.selectedCommandId])
  

  return (
    <Dialog open={open} onOpenChange={close}>

      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Schedule Command</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Schedule Type Selector */}
          <div className="flex space-x-2">
            {(["Once", "Daily", "Weekly", "Monthly"] as const).map((type) => (
              <Button
                key={type}
                variant={scheduleType === type ? "default" : "outline"}
                onClick={() => setScheduleType(type)}
                className="flex-1"
              >
                {type}
              </Button>
            ))}
          </div>

          {renderContent()}

          {/* Reminder Section */}
          {
            (scheduleType!='Daily' && scheduleType!='Once') && (
              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder"
                    checked={showReminder}
                    onCheckedChange={(checked) => setShowReminder(checked as boolean)}
                  />
                  <label
                    htmlFor="reminder"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable Reminders
                  </label>
                </div>

                {showReminder && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Reminder Starts From<span className="text-destructive">*</span>
                      </label>
                      <Input type="datetime-local" placeholder="Select time" className="mt-2" onBlur={(e)=>{setStartReminder(e.currentTarget.value)}} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Repeat Interval<span className="text-destructive">*</span>
                      </label>
                      
                      <ComboboxInput 
                        onSelect={(val)=>{setRepetition(val as string)}} 
                        items={[
                          {
                            label: 'Every 5 minutes', value: '5m'
                          },
                          {
                            label: 'Every 10 minutes', value: '10m'
                          },
                          {
                            label: 'Every 15 minutes', value: '15m'
                          },
                          {
                            label: 'Every 30 minutes', value: '30m'
                          },
                          {
                            label: 'Every 1 hour', value: '1hr'
                          },
                        ]} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Duration<span className="text-destructive">*</span>
                      </label>
                      
                      <ComboboxInput 
                        onSelect={(val)=>{setDuration(val as string)}} 
                        items={[
                          {
                            label: 'Every 15 minutes', value: '15 minutes'
                          },
                          {
                            label: 'Every 30 minutes', value: '30 minutes'
                          },
                          {
                            label: 'Every 1 hour', value: '1 hour'
                          },
                          {
                            label: 'Every 12 hour', value: '12 hours'
                          },
                          {
                            label: 'Every 1 day', value: '1 day'
                          },
                          {
                            label: 'Indefinitely', value: 'Indefinitely'
                          },
                        ]} 
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          }

          <div className="flex justify-end">
            <Button type="submit" onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}