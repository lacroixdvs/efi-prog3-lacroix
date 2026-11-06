"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Comentario {
  id: number;
  texto: string;
  usuario_username?: string;
  usuario?: string;
  creado?: string;
}

const API = "http://localhost:8000/api";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Carga del post y sus comentarios desde Django REST
  const cargarDetalle = async () => {
    try {
      // 1. Obtener Post
      const resP = await fetch(`${API}/posts/${id}/`);
      if (resP.ok) {
        const dataP = await resP.json();
        setPost(dataP);
      }

      // 2. Obtener Comentarios
      const resC = await fetch(`${API}/comentarios/`);
      if (resC.ok) {
        const dataC = await resC.json();
        const lista: Comentario[] = Array.isArray(dataC) ? dataC : dataC.results || [];
        // Filtra los comentarios pertenecientes a este post en particular
        const filtrados = lista.filter((c: any) => String(c.post) === String(id));
        setComentarios(filtrados);
      }
    } catch (e) {
      console.log("Error al cargar post o comentarios:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  // Enviar un comentario
  const handleEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    setEnviando(true);
    const token = localStorage.getItem("access");
    const currentUser = localStorage.getItem("user") || "Alumno";

    try {
      const res = await fetch(`${API}/comentarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          post: Number(id),
          texto: nuevoComentario,
          usuario_username: currentUser,
        }),
      });

      if (res.ok) {
        setNuevoComentario("");
        cargarDetalle(); // Recarga los comentarios al instante
      } else {
        alert("No se pudo enviar el comentario. Verificá tu sesión.");
      }
    } catch (err) {
      alert("Error de conexión al enviar el comentario.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen text-white flex items-center justify-center">
        <p className="text-[#FF4D00] font-black tracking-widest text-xs animate-pulse">
          CARGANDO ARTÍCULO Y COMENTARIOS...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#080808] min-h-screen text-white py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/blog" className="text-xs text-[#FF4D00] font-bold tracking-widest hover:underline">
          ← VOLVER AL BLOG
        </Link>

        {/* Post Principal */}
        <article className="bg-[#101010] border border-white/10 p-8 rounded-3xl space-y-4">
          <span className="text-[10px] bg-[#FF4D00]/20 text-[#FF4D00] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            Artículo #{id}
          </span>
          <h1 className="text-3xl font-black uppercase">{post?.titulo || `Publicación N° ${id}`}</h1>
          <p className="text-sm text-white/70 leading-relaxed">
            {post?.contenido || "Contenido del artículo de entrenamiento y nutrición de Fitness Lacroix."}
          </p>
        </article>

        {/* Sección de Comentarios */}
        <section className="bg-[#101010] border border-white/10 p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
            Comentarios <span className="text-xs text-[#FF4D00]">({comentarios.length})</span>
          </h3>

          {/* Formulario para agregar comentario */}
          <form onSubmit={handleEnviarComentario} className="space-y-3">
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Escribí tu opinión o consulta sobre este tema..."
              className="w-full bg-[#181818] border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-[#FF4D00]"
              rows={3}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={enviando}
                className="bg-[#FF4D00] text-black font-black text-xs px-6 py-3 rounded-xl hover:bg-white transition-all uppercase"
              >
                {enviando ? "Publicando..." : "Comentar"}
              </button>
            </div>
          </form>

          {/* Lista de comentarios */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            {comentarios.length === 0 ? (
              <p className="text-xs text-white/30 italic">No hay comentarios aún. ¡Sé el primero en opinar!</p>
            ) : (
              comentarios.map((c) => (
                <div key={c.id} className="bg-[#181818] border border-white/5 p-4 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#FF4D00]">
                      @{c.usuario_username || c.usuario || "Alumno"}
                    </span>
                    {c.creado && (
                      <span className="text-[10px] text-white/30">
                        {new Date(c.creado).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/80">{c.texto}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}