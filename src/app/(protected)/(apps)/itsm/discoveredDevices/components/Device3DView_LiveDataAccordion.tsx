import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { FC } from "react";
import { v4 } from "uuid";

type LiveDataType = {
    metricsName: string;
    serviceId: string;
    value: unknown;
}[] | undefined

type Props = {
    data: LiveDataType;
}

const checkType = (value: unknown) => {
    if (Array.isArray(value)) return "array";
    if (typeof value === "object" && value !== null) return "object";
    return "neither";
}

const LiveDataAccordion: FC<Props> = ({ data }) => {
    return (
        <div className="max-h-[40rem] p-4">
            <Accordion type="single" collapsible className="w-full">
                {data && data.map((obj) => {
                    const objType = checkType(obj.value);

                    return (
                        <AccordionItem key={obj.serviceId} value={obj.metricsName}>
                            <AccordionTrigger>{obj.metricsName}</AccordionTrigger>
                            <AccordionContent>
                                {objType === "object" && (
                                    <ul>
                                        {Object.entries(obj.value as Record<string, unknown>).map(([key, val]) => (
                                            <li key={v4()}><strong>{key}</strong>: {JSON.stringify(val)}</li>
                                        ))}
                                    </ul>
                                )}

                                {objType === "array" && (
                                    <Table className="border">
                                        <TableHeader>
                                            <TableRow>
                                                {/* Dynamically render headers from first object in array */}
                                                
                                                {
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    (obj.value as any[])[0] &&
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    Object.keys((obj.value as any[])[0]).map((key) => (
                                                        <TableHead key={v4()}>{key}</TableHead>
                                                    ))
                                                }
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                (obj.value as any[]).map((row) => (
                                                    <TableRow key={v4()}>
                                                        {Object.values(row).map((val) => (
                                                            <TableCell key={v4()}>{JSON.stringify(val)}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                )}

                                {objType === "neither" && (
                                    <pre>{JSON.stringify(obj.value)}</pre>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default LiveDataAccordion;
