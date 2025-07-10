import { Views } from "react-big-calendar";
import { Fragment, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { BigCalenderToolbarProps } from "../../big-calendar/type";

// Custom toolbar component
export default function BigCalenderToolbar({ onNavigate, onView, label, extraTools, view }: BigCalenderToolbarProps) {
    const [calViewsValue, setValue] = useState(view === Views.DAY ? "DAY" : view === Views.WEEK ? "WEEK" : "MONTH");
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <ToggleGroup type="single" variant='outline' onValueChange={(value: string) => {
                    switch (value) {
                        case "PREV":
                            onNavigate("PREV");
                            break;
                        case "NEXT":
                            onNavigate("NEXT");
                            break;
                        case "TODAY":
                            onNavigate("TODAY");
                            break;
                        default:
                            break;
                    }
                }}>
                    <ToggleGroupItem className="rounded-e-none" value="PREV">
                        <ChevronLeft size={16} />
                    </ToggleGroupItem>
                    <ToggleGroupItem className='rounded-none border-x-0' value="NEXT">
                        <ChevronRight size={16} />
                    </ToggleGroupItem>
                    <ToggleGroupItem className='rounded-s-none' value="TODAY">
                        Today
                    </ToggleGroupItem>
                </ToggleGroup>
                <span className="ml-auto">
                    {label}
                </span>
                <div className="flex flex-row gap-2">

                    {
                        extraTools?.map((tool, index: number) =>
                            <Fragment key={index}>
                                {tool}
                            </Fragment>
                        )
                    }

                    <ToggleGroup type="single" variant='outline' value={calViewsValue} onValueChange={(value: string) => {
                        setValue(value);
                        switch (value) {
                            case "DAY":
                                onView(Views.DAY);
                                break;
                            case "WEEK":
                                onView(Views.WEEK);
                                break;
                            case "MONTH":
                                onView(Views.MONTH);
                                break;
                            default:
                                break;
                        }
                    }}>
                        {/* <ToggleGroupItem className="rounded-e-none" value="DAY">
                            Day
                        </ToggleGroupItem>
                        <ToggleGroupItem className='rounded-none border-x-0' value="WEEK">
                            Week
                        </ToggleGroupItem>
                        <ToggleGroupItem className='rounded-s-none' value="MONTH">
                            Month
                        </ToggleGroupItem> */}
                    </ToggleGroup>
                </div>
            </div>
        </>
    );
}


// @/ikon/components/big-calendar-grc/big-calender-toolbar.js
// import { Views } from "react-big-calendar";
// import { Fragment, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group"; // Ensure path is correct
// import { BigCalenderToolbarProps } from "../../big-calendar/type";

// // Custom toolbar component
// export default function BigCalenderToolbar({
//   onNavigate,
//   onView,
//   label,
//   extraTools,
//   view,
//   extraParamsEvent // Receive extraParamsEvent for legend types/colors
// }: BigCalenderToolbarProps) {
//   const [calViewsValue, setValue] = useState(
//     view === Views.DAY ? "DAY" : view === Views.WEEK ? "WEEK" : "MONTH"
//   );

//   const eventTypeDefs = extraParamsEvent?.eventTypeDefs;

//   return (
//     <>
//       <div className="rbc-toolbar"> {/* Standard RBC toolbar class */}
//         {/* Navigation Group */}
//         <span className="rbc-btn-group">
//            <ToggleGroup
//              type="single"
//              variant="outline"
//              onValueChange={(value: string) => {
//                if (value) onNavigate(value as any); // TODAY, NEXT, PREV
//              }}
//             >
//                 <ToggleGroupItem value="PREV" aria-label="Previous">
//                    <ChevronLeft className="h-4 w-4" />
//                 </ToggleGroupItem>
//                 <ToggleGroupItem value="TODAY">Today</ToggleGroupItem>
//                 <ToggleGroupItem value="NEXT" aria-label="Next">
//                     <ChevronRight className="h-4 w-4" />
//                 </ToggleGroupItem>
//             </ToggleGroup>
//         </span>

//         {/* Label and Legend */}
//         <span className="rbc-toolbar-label-container">
//              <span className="rbc-toolbar-label">{label}</span>
//              {/* Legend Section */}
//              {eventTypeDefs && (
//                  <span className="calendar-legend">
//                      {Object.entries(eventTypeDefs).map(([type, def]) => (
//                          <span key={type} className="legend-item">
//                              <span
//                                 className={`legend-dot event-dot-${type}`}
//                                 style={{ backgroundColor: def.color }}
//                              ></span>
//                              <span className="legend-label">{def.label}</span>
//                          </span>
//                      ))}
//                  </span>
//              )}
//         </span>


//         {/* Extra Tools and View Switcher */}
//         <span className="rbc-btn-group rbc-toolbar-right"> {/* Group right-aligned items */}
//             {/* Render extra tools if any */}
//             {extraTools?.map((tool, index: number) => (
//                <Fragment key={index}>{tool}</Fragment>
//             ))}

//            {/* View Switcher */}
//             <ToggleGroup
//              type="single"
//              variant="outline"
//              value={calViewsValue}
//              onValueChange={(value: string) => {
//                if (value) {
//                   setValue(value);
//                   onView(value as any); // MONTH, WEEK, DAY
//                }
//              }}
//             >
//                <ToggleGroupItem value="DAY">Day</ToggleGroupItem>
//                <ToggleGroupItem value="WEEK">Week</ToggleGroupItem>
//                <ToggleGroupItem value="MONTH">Month</ToggleGroupItem>
//             </ToggleGroup>
//         </span>
//       </div>
//     </>
//   );
// }