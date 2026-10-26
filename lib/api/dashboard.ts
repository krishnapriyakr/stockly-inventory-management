import { getDashboardStats } from "@/app/action/dashboard";

export const dashboardApi = {
  getStats: () => getDashboardStats(),
};