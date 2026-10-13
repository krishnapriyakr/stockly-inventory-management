import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  toggleCategoryActive,
  deleteCategory,
} from "@/app/action/categories";

export const categoriesApi = {
  list: () => getCategories(),
  getById: (id: string) => getCategoryById(id),
  create: (formData: FormData) => createCategory(formData),
  update: (id: string, formData: FormData) => updateCategory(id, formData),
  toggleActive: (id: string, isActive: boolean) =>
    toggleCategoryActive(id, isActive),
  remove: (id: string) => deleteCategory(id),
};