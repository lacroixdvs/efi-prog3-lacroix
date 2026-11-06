import { describe, it, expect } from "vitest";
import { loginSchema, planSchema } from "./schemas";

describe("Pruebas Unitarias de Esquemas Zod - Fitness Lacroix", () => {
  it("Debe validar correctamente credenciales de login válidas", () => {
    const result = loginSchema.safeParse({
      username: "admin",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("Debe rechazar un login con un usuario de menos de 3 caracteres", () => {
    const result = loginSchema.safeParse({
      username: "ab",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("Debe validar correctamente un plan de membresía válido", () => {
    const result = planSchema.safeParse({
      nombre: "VIP PASS",
      precio: 15000,
      descripcion: "Acceso ilimitado a todas las áreas del gimnasio.",
    });
    expect(result.success).toBe(true);
  });

  it("Debe rechazar un plan si el precio es menor o igual a 0", () => {
    const result = planSchema.safeParse({
      nombre: "Pase Diario",
      precio: 0,
      descripcion: "Pase individual de prueba por un día.",
    });
    expect(result.success).toBe(false);
  });
});