import { z } from "zod";

// Esquema 1: Login
export const loginSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

// Esquema 2: Alta/Edición de Plan o Membresía
export const planSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  precio: z.coerce.number().min(1, "El precio debe ser un número mayor a 0"),
  descripcion: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PlanFormData = z.infer<typeof planSchema>;