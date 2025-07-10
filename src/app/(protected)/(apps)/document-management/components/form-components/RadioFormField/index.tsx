import { FormField, FormItem, FormLabel, FormControl } from "@/shadcn/ui/form";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { RadioFormFieldProps } from "../types";

export const RadioFormField: React.FC<RadioFormFieldProps> = ({ field }) => {
  return (
    <FormField
      name={field.name}
      render={({ field: radioField }) => (
        <FormItem>
          <FormLabel>{field.question}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={radioField.onChange}
              defaultValue={radioField.value as string}
            >
              {field.options.map((option: any) => (
                <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value={option} />
                  <FormLabel>{option}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};