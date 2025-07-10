import Icon from '../icon'
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shadcn/ui/form"
import { Input } from "@/shadcn/ui/input"
import { Card, CardContent } from "@/shadcn/ui/card"

interface InputFormFieldProps {
    form: any;
    dataType?: string;
    name: string;
    label: string;
    placeholder?: string;
    iconName?: string;
    viewMode?: boolean;
    required?: boolean;
}
export default function InputFormField(InputFormFieldProps: InputFormFieldProps) {
    const { form, dataType, name, label, placeholder, iconName, viewMode, required } = InputFormFieldProps;
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Card className="w-full">
                            <CardContent className="p-2 flex items-center gap-2 border rounded-md">
                                <div className="p-2 border-r flex items-center">
                                    {/* <FileText className="w-5 h-5 text-gray-500" /> */}
                                    <Icon name={iconName} className="w-5 h-5 text-gray-500" />
                                </div>
                                {/* Floating label wrapper */}
                                <div className="flex-1 relative">
                                    {/* <Input
                                        id={name}
                                        placeholder=" "
                                        className="peer h-12 w-full px-2 pt-2 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                        {...field}
                                    /> */}
                                    <Input
                                        type={dataType}
                                        id={name}
                                        disabled={viewMode}
                                        placeholder=" "
                                        className="peer h-12 w-full px-2 pt-2 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            const parsedValue = e.target.type === "number" ? +value : value
                                            field.onChange(parsedValue)
                                        }}
                                    />
                                    {/* <label
                                        htmlFor={name}
                                        // className="absolute px-2 top-2 text-gray-500 text-sm transition-all 
                                        //                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                                        //                peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-500 
                                        //                peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                                        className="absolute px-2 top-0 text-gray-500 text-sm transition-all 
                                                       peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                                                       peer-focus:text-xs peer-focus:text-gray-500 
                                                       peer-[&:not(:placeholder-shown)]:text-xs"

                                    >
                                        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                                    </label> */}
                                    <label
                                        htmlFor={name}
                                        className="absolute px-2 top-0 text-gray-400 text-base transition-all
                                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
                                                    peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-500
                                                    peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs"
                                    >
                                        {label}
                                        {required && <span className="text-red-500 ml-0.5">*</span>}
                                    </label>


                                </div>
                            </CardContent>
                        </Card>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}