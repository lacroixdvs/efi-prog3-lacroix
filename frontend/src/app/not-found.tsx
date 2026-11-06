import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#080808] min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-black text-[#FF4D00]">404</h1>
      <h2 className="text-2xl font-black uppercase mt-4">Página no encontrada</h2>
      <p className="text-xs text-white/40 mt-2 max-w-sm">
        La ruta a la que intentas acceder no existe o fue movida en la plataforma de Fitness Lacroix.
      </p>
      <Link
        href="/"
        className="mt-6 bg-[#FF4D00] text-black font-black text-xs px-6 py-3 rounded-xl hover:bg-white transition-all uppercase"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}