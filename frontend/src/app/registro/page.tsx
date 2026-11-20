"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registroSchema, RegistroFormData } from "@/lib/schemas";
import { saveAuthCookies } from "@/lib/api";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function RegistroPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      plan: "BEAST",
    },
  });

  const onSubmit = async (data: RegistroFormData) => {
    setLoading(true);
    setApiError(null);

    try {
      // 1. Registrar alumno en Django
      const resReg = await fetch(`${API}/registro/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          es_premium: data.plan === "BEAST PRO",
        }),
      });

      if (!resReg.ok) {
        const errJson = await resReg.json().catch(() => null);
        if (errJson?.username) {
          setApiError("Ese nombre de usuario ya está en uso. Probá con otro.");
        } else if (errJson?.email) {
          setApiError("Ese correo electrónico ya está registrado.");
        } else {
          setApiError("No se pudo completar el registro. Revisá los datos ingresados.");
        }
        setLoading(false);
        return;
      }

      // 2. Obtener token JWT y guardarlo en Cookies automáticamente
      const resToken = await fetch(`${API}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (resToken.ok) {
        const tokenData = await resToken.json();
        saveAuthCookies(
          tokenData.access,
          tokenData.refresh || "",
          data.username,
          false
        );
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (e) {
      setApiError("No se pudo conectar con el servidor de Django (puerto 8000).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex items-center justify-center p-6">
      <div className="bg-[#101010] border border-white/10 p-8 rounded-[2rem] w-full max-w-md">
        <h1 className="font-black text-2xl uppercase text-center mb-2">
          UNITE A <span className="text-[#FF4D00]">LACROIX</span>
        </h1>
        <p className="text-xs text-white/40 text-center mb-6">
          Creá tu cuenta de alumno para comentar en el blog y gestionar tu plan
        </p>

        {apiError && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4 text-center font-semibold">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nombre de usuario"
            placeholder="Ej: martinperez"
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            placeholder="martin@email.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            {...register("password")}
            error={errors.password?.message}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Elegí tu plan
            </label>
            <select
              {...register("plan")}
              className="bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4D00]"
            >
              <option value="BEAST">PLAN BEAST ($25.000 / mes)</option>
              <option value="BEAST PRO">PLAN BEAST PRO ⭐ ($35.000 / mes)</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Creando cuenta..." : "Registrarme"}
          </Button>
        </form>

        <p className="text-xs text-white/40 mt-6 text-center">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[#FF4D00] font-bold hover:underline">
            Iniciá sesión acá
          </Link>
        </p>
      </div>
    </div>
  );
}