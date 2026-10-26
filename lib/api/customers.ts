import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "@/app/action/customers";

export const customersApi = {
  list: () => getCustomers(),
  getById: (id: string) => getCustomerById(id),
  create: (formData: FormData) => createCustomer(formData),
  update: (id: string, formData: FormData) => updateCustomer(id, formData),
  remove: (id: string) => deleteCustomer(id),
};