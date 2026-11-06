import { Suspense } from "react";

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="bg-[#080808] text-white min-h-screen p-8 flex justify-center items-center">
        <p className="text-[#FF4D00] animate-pulse font-bold">Cargando...</p>
      </div>
    }>
      {children}
    </Suspense>
  );
}