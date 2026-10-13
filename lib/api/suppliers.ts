import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  toggleSupplierActive,
  deleteSupplier,
} from "@/app/action/suppliers";

export const suppliersApi = {
  list: () => getSuppliers(),
  getById: (id: string) => getSupplierById(id),
  create: (formData: FormData) => createSupplier(formData),
  update: (id: string, formData: FormData) => updateSupplier(id, formData),
  toggleActive: (id: string, isActive: boolean) =>
    toggleSupplierActive(id, isActive),
  remove: (id: string) => deleteSupplier(id),
};