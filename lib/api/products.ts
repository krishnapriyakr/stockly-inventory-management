import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  toggleProductActive,
  deleteProduct,
} from "@/app/action/products";

export const productsApi = {
  list: () => getProducts(),
  getById: (id: string) => getProductById(id),
  create: (formData: FormData) => createProduct(formData),
  update: (id: string, formData: FormData) => updateProduct(id, formData),
  toggleActive: (id: string, isActive: boolean) =>
    toggleProductActive(id, isActive),
  remove: (id: string) => deleteProduct(id),
};