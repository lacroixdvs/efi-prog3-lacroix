"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, LoginFormData } from "@/lib/schemas";
import { saveAuthCookies } from "@/lib/api";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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
      const res = await fetch(`${API}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const responseData = await res.json();
        const isAdminUser = username.toLowerCase() === "admin";

        saveAuthCookies(
          responseData.access,
          responseData.refresh || "",
          username,
          isAdminUser
        );

        router.push(isAdminUser ? "/dashboard" : "/");
      } else {
        setApiError("Usuario o contraseña incorrectos. (Si sos alumno creado desde el panel, tu clave por defecto es 12345678).");
      }
    } catch (e) {
      setApiError("No se pudo conectar con el servidor de Django (puerto 8000).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex items-center justify-center p-6">
      <div className="bg-[#101010] border border-white/10 p-8 rounded-[2rem] w-full max-w-sm">
        <h1 className="font-black text-2xl uppercase text-center mb-2">
          LOGIN <span className="text-[#FF4D00]">LACROIX</span>
        </h1>
        <p className="text-xs text-white/40 text-center mb-6">
          Ingresá con tu cuenta de Fitness Lacroix
        </p>

        {apiError && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4 text-center font-semibold">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Usuario"
            placeholder="Ej: gomezcarlos"
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

        <p className="text-xs text-white/40 mt-5 text-center">
          ¿Todavía no sos alumno?{" "}
          <Link href="/registro" className="text-[#FF4D00] font-bold hover:underline">
            Registrate acá
          </Link>
        </p>

        <p className="text-[10px] text-white/30 mt-4 text-center leading-relaxed">
          Alumnos dados de alta por admin: contraseña inicial 12345678
        </p>
      </div>
    </div>
  );
}