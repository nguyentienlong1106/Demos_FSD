// components/AttributesField.tsx
import React, { useRef, useEffect } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface AttributesFieldProps {
  label: string;
  name: string;
}

export const AttributesField: React.FC<AttributesFieldProps> = ({
  label,
  name,
}) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes", // Ensure this matches the form's field name
  });
  const handleAdd = () => {
    append({ id: uuidv4(), attribute: "", values: "" });
  };

  const lastInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (index: number) => {
    if (index === fields.length - 1) {
      handleAdd();
    }
  };
  useEffect(() => {
    if (lastInputRef.current) {
      (
        lastInputRef.current.parentNode?.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement
      )?.focus();
    }
  }, [fields]);

  const handleRemove = (index: number) => {
    remove(index);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>
            <span className="font-semibold">{label}</span>
          </FormLabel>
          <FormControl>
            <div className="flex flex-col gap-4 w-full rounded-lg border relative p-6">
              <div className="flex ">
                <span className="flex-1">Thuộc Tính</span>
                <span className="flex-1">Giá Trị</span>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 content-center">
                  <div
                    className="flex-1"
                    ref={index === fields.length - 2 ? lastInputRef : null}
                  >
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder=""
                          type="text"
                          {...control.register(`attributes.${index}.attribute`)}
                          onChange={() => handleInputChange(index)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <div
                    className="flex-1"
                    ref={index === fields.length - 2 ? lastInputRef : null}
                  >
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder=""
                          type="text"
                          {...control.register(`attributes.${index}.values`)}
                          onChange={() => handleInputChange(index)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="flex-none"
                  >
                    -
                  </button>
                </div>
              ))}
              <div>
                <Button type="button" onClick={handleAdd}>
                  +
                </Button>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
