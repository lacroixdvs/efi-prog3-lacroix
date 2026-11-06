import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl tracking-[0.3em] font-light">
          FITLAB
        </Link>
        <nav className="flex gap-8 text-xs tracking-widest">
          <Link href="/blog">BLOG</Link>
          <Link href="/membership">MEMBERSHIP</Link>
          <Link href="/profesores">PROFESORES</Link>
          <Link href="/dashboard">DASHBOARD</Link>
          <Link href="/login">LOGIN</Link>
        </nav>
      </div>
    </header>
  );
}