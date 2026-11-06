"use client";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import "./globals.css";

function NavbarHeader() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      const adminFlag = localStorage.getItem("is_admin");

      setCurrentUser(user && user !== "null" ? user : null);
      setIsAdmin(adminFlag === "true");
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  return (
    <header className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-[#FF4D00] font-black text-2xl leading-none">
          FITNESS<br />LACROIX
        </Link>
        
        <nav className="hidden md:flex gap-6 text-xs tracking-widest text-white/60 items-center">
          <Link href="/" className="hover:text-white transition-colors">INICIO</Link>
          <Link href="/blog" className="hover:text-white transition-colors">BLOG</Link>
          <Link href="/membership" className="hover:text-white transition-colors">MEMBRESIAS</Link>
          <Link href="/profesores" className="hover:text-white transition-colors">PROFESORES</Link>

          {/* DASHBOARD solo visible si es ADMIN */}
          {isAdmin && (
            <Link href="/dashboard" className="text-[#FF4D00] font-bold hover:text-white transition-colors">
              DASHBOARD
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            /* Estado 2 y 3: Usuario o Admin logueado */
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  {isAdmin ? "ROLE: ADMIN" : "ROLE: USUARIO"}
                </p>
                <p className="text-xs font-black text-[#FF4D00] uppercase">
                  {currentUser}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="border border-white/20 px-4 py-1.5 text-[10px] font-bold tracking-widest hover:bg-red-600 hover:border-red-600 transition-all rounded-md"
              >
                SALIR
              </button>
            </div>
          ) : (
            /* Estado 1: Invitado sin sesión */
            <Link href="/login" className="border border-white/20 px-6 py-2 text-xs hover:bg-white/10 transition-all">
              ACCESO
            </Link>
          )}

          <Link href="/membership" className="bg-[#FF4D00] text-black px-6 py-2 text-xs font-black hover:bg-white transition-all">
            UNETE AHORA
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#080808] text-white antialiased">
        <Suspense fallback={<div className="h-20 bg-[#0A0A0A] border-b border-white/10" />}>
          <NavbarHeader />
        </Suspense>

        <main>{children}</main>

        <footer className="bg-black border-t border-white/10 py-12 text-center text-[10px] text-white/30">
          © 2026 FITNESS LACROIX - RIO CUARTO, CORDOBA - NO EXCUSES
        </footer>
      </body>
    </html>
  );
}