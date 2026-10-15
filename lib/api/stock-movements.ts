import {
  recordMovement,
  getMovements,
  getMovementsForProduct,
} from "@/app/action/stock-movements";

export const stockMovementsApi = {
  record: (formData: FormData) => recordMovement(formData),
  list: (filters?: { q?: string; type?: string }) => getMovements(filters),
  forProduct: (productId: string) => getMovementsForProduct(productId),
};