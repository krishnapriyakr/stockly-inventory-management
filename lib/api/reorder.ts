import { getReorderSuggestions } from "@/app/action/reorder";

export const reorderApi = {
  getSuggestions: () => getReorderSuggestions(),
};