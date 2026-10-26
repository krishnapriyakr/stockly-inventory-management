import {
  getCategoryOptions,
  getSupplierOptions,
  getProductOptions,
  getCustomerOptions,
} from "@/app/action/dropdowns";

export const dropdownsApi = {
  categories: () => getCategoryOptions(),
  suppliers: () => getSupplierOptions(),
  products: () => getProductOptions(),
  customers: () => getCustomerOptions(),
};