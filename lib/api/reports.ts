import { getReportsData } from "@/app/action/reports";

export const reportsApi = {
  getData: (range: string) => getReportsData(range),
};