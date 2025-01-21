import * as z from "zod";

export const formSchema = z.object({
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
