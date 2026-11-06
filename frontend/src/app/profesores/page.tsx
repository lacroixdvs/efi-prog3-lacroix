"use client";
import React from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

interface Profesor {
  id: number;
  nombre: string;
  especialidad: string;
  experiencia: string;
  imagen: string;
  bio: string;
}

const PROFESORES: Profesor[] = [
  {
    id: 1,
    nombre: "MARCOS VARELA",
    especialidad: "Powerlifting & Hipertrofia",
    experiencia: "8 años de experiencia",
    imagen: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800",
    bio: "Especialista en fuerza máxima y biomecánica aplicada al entrenamiento de alta intensidad.",
  },
  {
    id: 2,
    nombre: "SOFÍA RAMÍREZ",
    especialidad: "Crossfit & Endurance",
    experiencia: "6 años de experiencia",
    imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800",
    bio: "Atleta de alto rendimiento focalizada en acondicionamiento metabólico y técnica funcional.",
  },
  {
    id: 3,
    nombre: "LUCAS BENÍTEZ",
    especialidad: "Calistenia & Movilidad",
    experiencia: "5 años de experiencia",
    imagen: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800",
    bio: "Experto en control corporal, reeducación postural y desarrollo de fuerza relativa.",
  },
];

export default function ProfesoresPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            STAFF <span className="text-[#FF4D00]">LACROIX</span>
          </h1>
          <p className="text-white/40 text-sm mt-3 uppercase tracking-wider">
            Entrenadores certificados listos para llevar tus límites al siguiente nivel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PROFESORES.map((profesor) => (
            <Card key={profesor.id} className="p-0 overflow-hidden border border-white/10 flex flex-col justify-between">
              <div>
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={profesor.imagen}
                    alt={profesor.nombre}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <span className="absolute bottom-4 left-4 bg-[#FF4D00] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {profesor.especialidad}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black uppercase">{profesor.nombre}</h3>
                  <p className="text-[11px] text-white/40 font-bold uppercase mt-1 tracking-widest">
                    {profesor.experiencia}
                  </p>
                  <p className="text-sm text-white/60 mt-4 leading-relaxed">
                    {profesor.bio}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-2">
                <Link href={`/profesores/${profesor.id}`} className="block">
                  <Button className="w-full bg-[#181818] border border-white/20 text-white hover:bg-[#FF4D00] hover:text-black transition-all">
                    Ver Enfoque & Perfil →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}