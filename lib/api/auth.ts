import { registerUser } from "@/app/action/auth";

export const authApi = {
  register: (formData: FormData) => registerUser(formData),
};