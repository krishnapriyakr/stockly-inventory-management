import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "@/app/action/categories";

export const categoriesApi = {
  list: () => getCategories(),

  create: (formData: FormData) => createCategory(formData),

  update: (id: string, formData: FormData) => updateCategory(id, formData),

  remove: (id: string) => deleteCategory(id),
};