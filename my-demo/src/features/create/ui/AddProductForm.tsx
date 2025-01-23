"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import { formSchema } from "../model/formSchema";
import { useFormStore } from "../lib/store";
import Editor from "@/shared/ui/TextEditor/Editor";
import { CustomFormField } from "@/shared/ui/CustomFormField";
import { FormFile } from "@/shared/ui/InputFile/FormFile";
import { AttributesField } from "@/shared/ui/AttributesField";
import { FormField } from "@/components/ui/form";

export function AddProductForm() {
  const { formData, updateFormData } = useFormStore();

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
      desc_lexical: formData.desc_lexical,
    },
  });

  const handleEditorChange = (editorStateJSON: string) => {
    return form.setValue("desc_lexical", editorStateJSON);
  };

  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

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

        <CustomFormField name="link" label="Đường Dẫn" placeholder="" type="" />

        <CustomFormField
          name="code"
          label="Mã Sản Phẩm"
          placeholder=""
          type=""
        />

        <CustomFormField
          name="name_product"
          label="Tên Sản Phẩm"
          placeholder=""
          type=""
        />

        <CustomFormField
          name="description"
          label="Mô Tả"
          placeholder=""
          type=""
        />

        <CustomFormField
          name="title_seo"
          label="Tiêu Đề SEO"
          placeholder=""
          type=""
          value={seoTitle}
          onChange={handleSeoInputChange}
        />

        <CustomFormField
          name="description_seo"
          label="Mô Tả SEO"
          placeholder=""
          type=""
          value={descSeo}
          onChange={handleDescSeoInputChange}
        />

        <FormFile name="files" label="Select File" />

        <AttributesField
          name="attributes"
          label="Thông số kĩ thuật / Thông tin bổ sung"
        />
        <span className="font-semibold">Nội Dung </span>
        <FormField
          control={form.control}
          name={"desc_lexical"}
          render={() => <Editor onEditorChange={handleEditorChange} />}
        />
      </form>
    </FormProvider>
  );
}
