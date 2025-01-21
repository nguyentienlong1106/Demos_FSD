"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
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
import { CloudUpload } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { DropzoneOptions } from "react-dropzone";
import Editor from "../conponents/TextEditor/Editor";

const formSchema = z.object({
  link: z.string().nonempty("Link không được để trống"),
  code: z.string().nonempty("Mã sản phẩm không được để trống"),
  name_product: z.string().nonempty("Tên sản phẩm không được để trống"),
  description: z.string().nonempty("Mô tả không được để trống"),
  title_seo: z.string().nonempty("Tiêu đề SEO không được để trống"),
  description_seo: z.string().nonempty("Mô tả SEO không được để trống"),
  attributes: z.array(
    z.object({
      id: z.string(),
      attribute: z.string(),
      values: z.string(),
    })
  ),
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(5, {
      message: "Maximum 5 files are allowed",
    })
    .nullable(),
});

export function AddProductForm() {
  const dropzone = {
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
      link: "",
      code: "",
      name_product: "",
      description: "",
      title_seo: "",
      description_seo: "",
      attributes: [{ id: uuidv4(), attribute: "", values: "" }],
      files: null,
    },
  });

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
            <FormItem>
              <FormLabel>
                <p className="font-semibold">Thêm Ảnh</p>
              </FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropzone}
                  reSelect={true}
                  className="bg-background rounded-lg p-2 max-w-[30vh]"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500 border"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
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
                        <FileUploaderItem
                          key={i}
                          index={i}
                          className="max-w-30 max-h-30 top-[-11vh]"
                          aria-roledescription={`file ${i + 1} containing ${
                            file.name
                          }`}
                        >
                          <AspectRatio ratio={1 / 1}>
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              fill
                              className="object-contain rounded-md"
                            />
                          </AspectRatio>
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
