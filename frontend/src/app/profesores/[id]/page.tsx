"use client";
import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const profesoresMock: Record<string, { nombre: string; especialidad: string; bio: string; experiencia: string }> = {
  "1": {
    nombre: "MARCOS VARELA",
    especialidad: "Powerlifting & Hipertrofia",
    bio: "Especialista en fuerza máxima y biomecánica aplicada al entrenamiento de alta intensidad.",
    experiencia: "8 años de experiencia",
  },
  "2": {
    nombre: "SOFÍA RAMÍREZ",
    especialidad: "Crossfit & Endurance",
    bio: "Atleta de alto rendimiento focalizada en acondicionamiento metabólico y técnica funcional.",
    experiencia: "6 años de experiencia",
  },
  "3": {
    nombre: "LUCAS BENÍTEZ",
    especialidad: "Calistenia & Movilidad",
    bio: "Experto en control corporal, reeducación postural y desarrollo de fuerza relativa.",
    experiencia: "5 años de experiencia",
  },
};

function ProfesorDetailContent() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || "1";

  const profe = profesoresMock[id] || {
    nombre: `PROFESOR #${id}`,
    especialidad: "Entrenador Personal LACROIX",
    bio: "Profesional enfocado en ayudarte a alcanzar tus objetivos físicos y superar tus límites.",
    experiencia: "Certificado en Fitness & Salud",
  };

  return (
    <div className="bg-[#101010] border border-white/10 p-8 rounded-3xl space-y-4">
      <span className="text-[10px] bg-[#FF4D00]/20 text-[#FF4D00] font-bold px-3 py-1 rounded-md uppercase tracking-wider inline-block">
        {profe.especialidad}
      </span>
      <h1 className="text-4xl font-black uppercase text-white">{profe.nombre}</h1>
      <p className="text-xs text-[#FF4D00] font-bold uppercase">{profe.experiencia}</p>
      <p className="text-sm text-white/70 leading-relaxed pt-4 border-t border-white/10">
        {profe.bio}
      </p>
    </div>
  );
}

export default function ProfesorDetailPage() {
  return (
    <div className="bg-[#080808] min-h-screen text-white py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link 
          href="/profesores" 
          className="text-xs text-[#FF4D00] font-bold tracking-widest hover:underline uppercase inline-block"
        >
          ← VOLVER A PROFESORES
        </Link>

        <Suspense fallback={
          <div className="bg-[#101010] border border-white/10 p-8 rounded-3xl animate-pulse">
            <p className="text-xs text-[#FF4D00] font-bold">Cargando perfil...</p>
          </div>
        }>
          <ProfesorDetailContent />
        </Suspense>
      </div>
    </div>
  );
}