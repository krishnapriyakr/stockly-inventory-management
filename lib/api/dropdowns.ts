import {
  getCategoryOptions,
  getSupplierOptions,
  getProductOptions,
} from "@/app/action/dropdowns";

export const dropdownsApi = {
  categories: () => getCategoryOptions(),
  suppliers: () => getSupplierOptions(),
  products: () => getProductOptions(),
};