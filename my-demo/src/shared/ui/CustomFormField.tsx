// components/CustomFormField.tsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface CustomFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export const CustomFormField: React.FC<CustomFormFieldProps> = ({
  name,
  label,
  placeholder,
  type,
  onChange,
  value,
}) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <p className="font-semibold">{label}</p>
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              value={value !== undefined ? value : field.value}
              onChange={
                onChange ? (e) => onChange(e.target.value) : field.onChange
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
