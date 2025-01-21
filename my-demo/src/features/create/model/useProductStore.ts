import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductFormState = {
  productCode: string;
  productName: string;
  price: number;
  seoTitle: string;
  seoDescription: string;
  attributes: { key: string; value: string }[];
  setForm: (form: Partial<ProductFormState>) => void;
  resetForm: () => void;
};

export const useProductStore = create(
  persist<ProductFormState>(
    (set) => ({
      productCode: "",
      productName: "",
      price: 0,
      seoTitle: "",
      seoDescription: "",
      attributes: [],
      setForm: (form) =>
        set((state) => ({
          ...state,
          ...form,
        })),
      resetForm: () =>
        set({
          productCode: "",
          productName: "",
          price: 0,
          seoTitle: "",
          seoDescription: "",
          attributes: [],
        }),
    }),
    {
      name: "product-form", // Key lưu trong localStorage
    }
  )
);
