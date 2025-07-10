import { FormField, FormItem, FormLabel, FormControl } from "@/shadcn/ui/form";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { CheckboxFormFieldProps } from "../types";

export const CheckboxFormField: React.FC<CheckboxFormFieldProps> = ({ field }) => {
  return (
    <FormField
      name={field.name}
      render={({ field: checkboxField }) => (
        <FormItem>
          <FormLabel>{field.question}</FormLabel>
          {field.options.map((option: any) => (
            <FormItem key={option.id} className="flex items-start space-x-3 space-y-0">
              <Checkbox
                value={option.label}
                checked={checkboxField.value?.includes(option.label)}
                onCheckedChange={(checked) =>
                  checkboxField.onChange(
                    checked
                      ? [...(checkboxField.value || []), option.label]
                      : (checkboxField.value || []).filter(
                          (value: string) => value !== option.label
                        )
                  )
                }
              />
              <FormLabel className="font-normal">{option.label}</FormLabel>
            </FormItem>
          ))}
        </FormItem>
      )}
    />
  );
};
