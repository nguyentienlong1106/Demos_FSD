"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CloudUpload, Paperclip } from "lucide-react";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { DropzoneOptions } from "react-dropzone";
import Editor from "../components/TextEditor/Editor";
import { formSchema } from "../model/formSchema";
import { useFormStore } from "../lib/store";

export function AddProductForm() {
  const { formData, updateFormData } = useFormStore();
  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 4,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: formData.link,
      code: formData.code,
      name_product: formData.name_product,
      description: formData.description,
      title_seo: formData.title_seo,
      description_seo: formData.description_seo,
      attributes: formData.attributes,
      files: formData.files,
    },
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
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

  const [isSeoEdited, setIsSeoEdited] = useState<boolean>(false);
  const [isDescSeoEdited, setIsDescSeoEdited] = useState<boolean>(false);

  const productName = form.watch("name_product");
  const seoTitle = form.watch("title_seo");
  const desc = form.watch("description");
  const descSeo = form.watch("description_seo");

  useEffect(() => {
    if (!isSeoEdited) {
      form.setValue("title_seo", productName);
    }
  }, [productName, isSeoEdited, form]);

  useEffect(() => {
    if (!isDescSeoEdited) {
      form.setValue("description_seo", desc);
    }
  }, [desc, isDescSeoEdited, form]);

  const handleSeoInputChange = (value: string) => {
    if (!isSeoEdited) setIsSeoEdited(true);
    form.setValue("title_seo", value);
  };

  const handleDescSeoInputChange = (value: string) => {
    if (!isDescSeoEdited) setIsDescSeoEdited(true);
    form.setValue("description_seo", value);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const handleSubmitForm = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-full mx-auto py-8 flex flex-col gap-4"
      >
        <div className="flex-none">
          <Button type="button" onClick={handleSubmitForm}>
            Bản nháp{" "}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Đường Dẫn</FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="font-semibold">Mã Sản Phẩm</p>
              </FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="font-semibold">Tên Sản Phẩm</p>
              </FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="font-semibold">Mô Tả </p>
              </FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title_seo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="font-semibold">Tiêu Đề SEO</p>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type=""
                  {...field}
                  value={seoTitle}
                  onChange={(e) => handleSeoInputChange(e.target.value)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description_seo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="font-semibold">Mô Tả SEO</p>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type=""
                  {...field}
                  value={descSeo}
                  onChange={(e) => handleDescSeoInputChange(e.target.value)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Select File</FormLabel>
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
                      field.value.map((file, i) => (
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
        <span className="font-semibold">
          Thông số kĩ thuật / Thông tin bổ sung{" "}
        </span>
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
                      {...form.register(`attributes.${index}.attribute`)}
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
                      {...form.register(`attributes.${index}.values`)}
                      onChange={() => handleInputChange(index)}
                      //   ref={index === fields.length ? lastInputRef : null}
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
              {" "}
              +{" "}
            </Button>
          </div>
        </div>
        <span className="font-semibold">Nội Dung </span>
        <Editor />
      </form>
    </FormProvider>
  );
}
