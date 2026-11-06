"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const imagesByCategory: any = {
  STRENGTH: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
  NUTRITION: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800",
  MINDSET: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800",
  RECOVERY: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
};

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // 1. INTENTO LEER DE DJANGO - ESTO ES LO REAL
        const res = await fetch("http://localhost:8000/api/posts/", { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          // Si tu API devuelve {results: []} o []
          const lista = Array.isArray(data) ? data : data.results || data.posts || [];
          if (lista.length > 0) {
            setPosts(lista);
            localStorage.removeItem("lacroix_posts_demo"); // BORRAMOS EL FALSO PARA QUE NO MOLESTE MÁS
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.log("No hay backend, usando demo");
      }

      // 2. FALLBACK SOLO SI NO HAY DJANGO CORRIENDO
      const d = localStorage.getItem("lacroix_posts_demo");
      if (d) {
        setPosts(JSON.parse(d));
      } else {
        setPosts([
          { id: 101, titulo: "PR DE SENTADILLA", contenido: "Como pasé de 100 a 180kg...", categoria: "STRENGTH", autor: "Nico" },
        ]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = posts.filter(p => {
    const cat = (p.categoria || p.category || "").toString().toUpperCase();
    const matchCat = filter==="TODOS" || cat.includes(filter);
    const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // BOTON PARA FORZAR BORRADO DEL LOCALSTORAGE VIEJO
  const limpiarCache = () => {
    localStorage.removeItem("lacroix_posts_demo");
    window.location.reload();
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.9]">BLOG<br/><span className="text-white/20">LACROIX</span></h1>
            <p className="text-white/40 text-sm mt-2">{loading ? "Cargando desde Django..." : `${posts.length} posts desde Django • Se borra si lo borrás en admin`}</p>
          </div>
          <div className="flex flex-col gap-2">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm" />
            <button onClick={limpiarCache} className="text-[10px] tracking-widest bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white">LIMPIAR CACHE VIEJO (CLICK ACÁ)</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-12">
  {filtered.map((p) => {
    const autorNombre = typeof p.autor === 'object' ? (p.autor?.username || "BEAST TEAM") : (p.autor || p.author || "BEAST TEAM");
    const cat = String(p.categoria || p.category || "STRENGTH").toUpperCase();
    const img = imagesByCategory[cat] || `https://picsum.photos/seed/${p.id}/600/400`;
    
    return (
      <Link 
        key={p.id} 
        href={`/blog/${p.id}`} 
        className="bg-[#101010] border border-white/10 rounded-[1.8rem] overflow-hidden hover:border-[#FF4D00]/50 block transition-all"
      >
        <div className="h-48 overflow-hidden relative">
          <img src={img} className="h-full w-full object-cover" alt={p.titulo || "Imagen blog"}/>
          <span className="absolute top-4 left-4 text-[10px] bg-[#FF4D00] text-black px-3 py-1.5 rounded-full font-black">{cat}</span>
        </div>
        <div className="p-6">
          <p className="text-[10px] text-white/30 tracking-widest">POR {String(autorNombre).toUpperCase()}</p>
          <h3 className="font-black text-xl uppercase mt-2">{p.titulo || p.title}</h3>
          <p className="text-sm text-white/50 mt-2 line-clamp-2">{p.contenido || p.content}</p>
        </div>
      </Link>
    );
  })}
</div>
        {filtered.length===0 && !loading && <p className="text-center mt-20 text-white/30">No hay posts. Si los borraste en Django, ya están borrados. Si siguen apareciendo, hacé click en LIMPIAR CACHE VIEJO.</p>}
      </div>
    </div>
  );
}