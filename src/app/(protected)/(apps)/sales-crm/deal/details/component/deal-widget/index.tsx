"use client"
import Widgets from "@/ikon/components/widgets";
import { WidgetProps } from "@/ikon/components/widgets/type";

export default function DealWidget({ widgetData }: { widgetData: WidgetProps[] }) {
    function widgetNumberClickedFunction(...args: (string | Record<string,string>)[]){
        // console.log('I am clicked with id: ')
        args.map((params) => {
            if (typeof params === "object" && params !== null) {
                console.log("Widget clicked with id: "+params?.id);
            } else {
                console.log(params);
            }
        });
    }
    return (
        <>
            <Widgets widgetData={widgetData} onButtonClickfunc={widgetNumberClickedFunction} />
        </>
    )
}