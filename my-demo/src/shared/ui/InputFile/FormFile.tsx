// components/FormFile.tsx
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Paperclip, CloudUpload } from "lucide-react";
import { DropzoneOptions } from "react-dropzone";
import { useFormContext } from "react-hook-form";
interface FormFileProps {
  name: string;
  label: string;
}

const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png"],
  },
  multiple: true,
  maxFiles: 4,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

export const FormFile: React.FC<FormFileProps> = ({ name, label }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-1/2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FileUploader
              value={field.value}
              onValueChange={field.onChange}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-background rounded-lg p-2"
            >
              <FileInput
                id="fileInput"
                className="outline-dashed outline-1 outline-slate-500"
              >
                <div className="flex items-center justify-center flex-col p-8 w-auto ">
                  <CloudUpload className="text-gray-500 w-10 h-10" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                    &nbsp; or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
              </FileInput>
              <FileUploaderContent>
                {field.value &&
                  field.value.map((file: File, i: number) => (
                    <FileUploaderItem key={i} index={i}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
