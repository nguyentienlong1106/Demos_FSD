import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AttributesItem {
  id: string;
  attribute: string;
  values: string;
}

interface FormData {
  link: string;
  code: string;
  name_product: string;
  description: string;
  title_seo: string;
  description_seo: string;
  attributes: AttributesItem[];
  files: File[] | null;
}

interface FormState {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const initialFormData: FormData = {
  link: "",
  code: "",
  name_product: "",
  description: "",
  title_seo: "",
  description_seo: "",
  attributes: [{ id: "", attribute: "", values: "" }],
  files: null,
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      formData: initialFormData,
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
    }),
    {
      name: "form-storage",
    }
  )
);
