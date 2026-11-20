"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getAccessToken } from "@/lib/api";

interface Comentario {
  id: number;
  texto: string;
  usuario_username?: string;
  usuario?: string;
  creado?: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Carga del post y sus comentarios desde Django REST
  const cargarDetalle = async () => {
    try {
      // 1. Obtener Post
      const dataP = await apiFetch(`/posts/${id}/`);
      setPost(dataP);

      // 2. Obtener Comentarios
      const dataC = await apiFetch("/comentarios/");
      const lista: Comentario[] = Array.isArray(dataC) ? dataC : dataC.results || [];
      // Filtra los comentarios pertenecientes a este post en particular
      const filtrados = lista.filter((c: any) => String(c.post) === String(id));
      setComentarios(filtrados);
    } catch (e) {
      console.log("Error al cargar post o comentarios:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(getAccessToken()));
    };

    checkAuth();
    cargarDetalle();

    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, [id]);

  // Enviar un comentario
  const handleEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    if (!getAccessToken()) {
      alert("Debés iniciar sesión para comentar.");
      return;
    }

    setEnviando(true);

    try {
      await apiFetch("/comentarios/", {
        method: "POST",
        body: JSON.stringify({
          post: Number(id),
          texto: nuevoComentario,
        }),
      });

      setNuevoComentario("");
      cargarDetalle(); // Recarga los comentarios al instante
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        alert("Tu sesión expiró. Por favor, volvé a iniciar sesión.");
        router.push("/login");
      } else {
        alert(`No se pudo enviar el comentario: ${err.message}`);
      }
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

          {/* Formulario solo visible si hay sesión iniciada */}
          {isLoggedIn ? (
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
          ) : (
            <div className="bg-[#181818] border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/60">
                Iniciá sesión con tu cuenta para dejar un comentario en este artículo.
              </p>
              <Link
                href="/login"
                className="bg-[#FF4D00] text-black font-black text-xs px-5 py-2.5 rounded-xl hover:bg-white transition-all uppercase shrink-0"
              >
                Iniciar sesión
              </Link>
            </div>
          )}

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