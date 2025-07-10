import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/shadcn/ui/input";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>

          <FormControl>
            <Input
              id={nameInSchema}
              className={`w-full ${className}`}
              {...props}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
