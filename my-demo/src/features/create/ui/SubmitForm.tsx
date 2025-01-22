// components/SubmitForm.tsx
"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStore } from "../lib/store"; // Import useFormStore
import { useEffect } from "react";

const formSchema = z.object({
  price: z.coerce.number(),
  state: z.string(),
});

export function SubmitForm() {
  const { formData, updateFormData } = useFormStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: formData.price,
      state: formData.state,
    },
  });
  useEffect(() => {
    form.reset({
      price: formData.price,
      state: formData.state,
    });
  }, [formData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData({ ...formData, ...values });
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" w-auto mx-auto flex flex-col gap-6 relative top-[-1px]"
      >
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {field.value === "public" ? (
                      <SelectValue placeholder="công khai" />
                    ) : field.value === "spam" ? (
                      <SelectValue placeholder="nháp" />
                    ) : field.value === "liên hệ" ? (
                      <SelectValue placeholder="contact" />
                    ) : (
                      <SelectValue placeholder="công khai" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">công khai</SelectItem>
                  <SelectItem value="spam">nháp</SelectItem>
                  <SelectItem value="contact">liên hệ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="relative top-7">
          Save
        </Button>
      </form>
    </Form>
  );
}
