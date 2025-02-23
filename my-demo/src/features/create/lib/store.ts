// lib/store.ts
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
  desc_lexical: string;
  price: number;
  state: string;
}

interface FormState {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setFormData: (key: keyof FormData, value: FormData[keyof FormData]) => void;
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
  desc_lexical: "",
  price: 0,
  state: "",
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      formData: initialFormData,
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setFormData: (key, value) =>
        set((state) => ({
          formData: { ...state.formData, [key]: value },
        })),
    }),
    {
      name: "form-storage",
    }
  )
);
