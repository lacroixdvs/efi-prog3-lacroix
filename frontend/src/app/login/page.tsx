"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormData } from "@/lib/schemas";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function Login() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);

    const { username, password } = data;

    try {
      // 1. Intento real contra Django JWT
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const responseData = await res.json();
        localStorage.setItem("access", responseData.access);
        localStorage.setItem("refresh", responseData.refresh || "");
        localStorage.setItem("user", username);
        
        // Asignamos rol admin si es usuario admin
        const isAdminUser = username.toLowerCase() === "admin";
        localStorage.setItem("is_admin", String(isAdminUser));

        // Disparamos evento para refrescar la Navbar al instante
        window.dispatchEvent(new Event("authChange"));

        router.push(isAdminUser ? "/dashboard" : "/");
        return;
      }
    } catch (e) {
      console.log("Servidor backend no disponible, evaluando modo demo...");
    } finally {
      setLoading(false);
    }

    // 2. Fallback de pruebas si no hay conexión con Django
    if (username === "admin" && password === "admin") {
      localStorage.setItem("access", "demo_token_para_EFI");
      localStorage.setItem("user", "admin");
      localStorage.setItem("is_admin", "true");

      window.dispatchEvent(new Event("authChange"));
      router.push("/dashboard");
    } else if (username !== "") {
      localStorage.setItem("access", "user_token");
      localStorage.setItem("user", username);
      localStorage.setItem("is_admin", "false");

      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    } else {
      setApiError("Credenciales inválidas. Usá admin/admin para el panel administrativo.");
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex items-center justify-center p-6">
      <div className="bg-[#101010] border border-white/10 p-8 rounded-[2rem] w-full max-w-sm">
        <h1 className="font-black text-2xl uppercase text-center mb-2">
          LOGIN <span className="text-[#FF4D00]">LACROIX</span>
        </h1>
        <p className="text-xs text-white/40 text-center mb-6">
          admin/admin = ADMIN | otro usuario = LECTURA
        </p>

        {apiError && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4 text-center font-semibold">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Usuario"
            placeholder="Ej: admin"
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Verificando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-[10px] text-white/30 mt-6 text-center leading-relaxed">
          Probá: admin/admin → te lleva al dashboard CRUD | nico/1234 → te lleva al home
        </p>
      </div>
    </div>
  );
}