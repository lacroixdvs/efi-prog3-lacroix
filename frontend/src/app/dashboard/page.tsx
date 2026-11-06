"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Esquema Zod para validar la creación/edición de Posts
const postSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  contenido: z.string().min(5, "El contenido debe tener al menos 5 caracteres"),
});

type PostFormData = z.infer<typeof postSchema>;
type Tab = "ALUMNOS" | "POSTS" | "COMENTARIOS" | "USUARIOS";

const API = "http://localhost:8000/api";

export default function DashboardPro() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [tab, setTab] = useState<Tab>("ALUMNOS");

  const [posts, setPosts] = useState<any[]>([]);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [usuariosDjango, setUsuariosDjango] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  // Estados de edición
  const [editingId, setEditingId] = useState<number | null>(null);
  const [alumnoNombre, setAlumnoNombre] = useState("");
  const [alumnoPlan, setAlumnoPlan] = useState("BEAST");
  const [alumnoEstado, setAlumnoEstado] = useState("ACTIVO");
  const [editingAlumnoId, setEditingAlumnoId] = useState<number | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // React Hook Form + Zod para Posts
  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    reset: resetPostForm,
    setValue: setPostValue,
    formState: { errors: postErrors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    const userName = localStorage.getItem("user");
    const isAdmin = localStorage.getItem("is_admin");

    if (!token || token === "null" || token === "") {
      router.push("/login");
      return;
    }
    if (isAdmin !== "true") {
      alert(`Entraste como USUARIO (${userName}). Vista reservada solo para ADMIN.`);
      router.push("/");
      return;
    }
    setAuth(true);
    setUser(userName || "admin");
  }, [router]);

  const load = async () => {
    try {
      // 1. Categorías
      const resCat = await fetch(`${API}/categorias/`, { headers: getHeaders() });
      if (resCat.ok) {
        const dCat = await resCat.json();
        setCategorias(Array.isArray(dCat) ? dCat : dCat.results || []);
      }

      // 2. Usuarios / Alumnos
      let resU = await fetch(`${API}/usuarios/`, { headers: getHeaders() });
      if (resU.status === 401) resU = await fetch(`${API}/usuarios/`);
      if (resU.ok) {
        const dU = await resU.json();
        const lista = Array.isArray(dU) ? dU : dU.results || [];
        setUsuariosDjango(lista);
        const alumnosMapeados = lista.map((u: any) => ({
          id: u.id,
          nombre: u.username,
          email: u.email || `${u.username}@lacroix.com`,
          plan: u.es_premium ? "BEAST PRO" : "BEAST",
          estado: u.is_active !== false ? "ACTIVO" : "VENCIDO",
          progreso: u.es_premium ? 85 : 62,
          _raw: u,
        }));
        setAlumnos(alumnosMapeados);
      }

      // 3. Posts (Blog)
      let resP = await fetch(`${API}/posts/`, { headers: getHeaders() });
      if (resP.status === 401) resP = await fetch(`${API}/posts/`);
      if (resP.ok) {
        const dP = await resP.json();
        setPosts(Array.isArray(dP) ? dP : dP.results || []);
      }

      // 4. Comentarios
      let resC = await fetch(`${API}/comentarios/`, { headers: getHeaders() });
      if (resC.status === 401) resC = await fetch(`${API}/comentarios/`);
      if (resC.ok) {
        const dC = await resC.json();
        const listaC = Array.isArray(dC) ? dC : dC.results || [];
        const norm = listaC.map((c: any) => ({
          id: c.id,
          texto: c.texto,
          postId: c.post,
          autor: { username: c.usuario_username || c.usuario || "Anónimo" },
          usuario: c.usuario,
          creado: c.creado,
        }));
        setComentarios(norm);
      }
    } catch (e) {
      console.log("Error al cargar datos de Django:", e);
    }
  };

  useEffect(() => {
    if (auth) load();
  }, [auth, tab]);

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  // Guardar o Editar Post con Zod
  const onSubmitPost = async (data: PostFormData) => {
    let categoriaId = categorias.length > 0 ? categorias[0].id : 1;

    if (editingId) {
      const res = await fetch(`${API}/posts/${editingId}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ titulo: data.titulo, contenido: data.contenido }),
      });
      if (!res.ok) {
        alert("No se pudo editar el post: " + res.status);
        return;
      }
      setEditingId(null);
    } else {
      const res = await fetch(`${API}/posts/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          titulo: data.titulo,
          contenido: data.contenido,
          categoria: categoriaId,
        }),
      });
      if (!res.ok) {
        alert("No se pudo crear el post: " + res.status + ". Verifica tu sesión de Admin.");
        return;
      }
    }
    resetPostForm();
    load();
  };

  // Guardar / Editar Alumno (Sólo pide Nombre y Apellido)
  const guardarAlumno = async () => {
    if (!alumnoNombre.trim()) return;

    // Limpia espacios y acentos para generar username y email válidos para Django
    const usernameLimpio = alumnoNombre
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remueve tildes
      .replace(/[^a-z0-9]/g, "");      // Remueve espacios y caracteres especiales

    const username = usernameLimpio;
    const email = `${usernameLimpio}@lacroix.com`;
    const es_premium = alumnoPlan === "BEAST PRO";
    const is_active = alumnoEstado === "ACTIVO";

    if (editingAlumnoId) {
      const res = await fetch(`${API}/usuarios/${editingAlumnoId}/`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ username, email, es_premium, is_active }),
      });
      if (!res.ok) {
        alert("Error al actualizar alumno: " + res.status);
        return;
      }
      setEditingAlumnoId(null);
    } else {
      const res = await fetch(`${API}/usuarios/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          username,
          email,
          es_premium,
          is_active,
          password: "12345678",
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        alert("Error al crear alumno: " + res.status + " " + txt.slice(0, 150));
        return;
      }
    }
    setAlumnoNombre("");
    setAlumnoPlan("BEAST");
    setAlumnoEstado("ACTIVO");
    load();
  };

  const startEditAlumno = (a: any) => {
    setEditingAlumnoId(a.id);
    setAlumnoNombre(a.nombre);
    setAlumnoPlan(a.plan);
    setAlumnoEstado(a.estado);
  };

  // Guardar / Borrar Comentario
  const saveCommentEdit = async () => {
    if (!editingCommentId) return;
    const res = await fetch(`${API}/comentarios/${editingCommentId}/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ texto: editingCommentText }),
    });
    if (!res.ok) {
      alert("Error al actualizar comentario: " + res.status);
      return;
    }
    setEditingCommentId(null);
    setEditingCommentText("");
    load();
  };

  const deleteComment = async (id: number) => {
    if (!confirm("¿Deseas eliminar este comentario definitivamente?")) return;
    await fetch(`${API}/comentarios/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    load();
  };

  const borrarUsuarioDjango = async (id: number) => {
    if (!confirm(`¿Borrar usuario #${id} de la base de datos de Django?`)) return;
    await fetch(`${API}/usuarios/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    load();
  };

  if (!auth) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center text-white">
        <p className="text-[#FF4D00] font-black tracking-widest animate-pulse uppercase text-xs">
          Verificando credenciales de Administrador...
        </p>
      </div>
    );
  }

  const activos = alumnos.filter((a) => a.estado === "ACTIVO").length;
  const vencidos = alumnos.filter((a) => a.estado === "VENCIDO").length;
  const ingresos = activos * 25000;

  return (
    <div className="bg-[#080808] text-white min-h-screen flex p-6 gap-6">
      {/* Sidebar Principal */}
      <aside className="w-64 bg-[#101010] border border-white/10 rounded-2xl p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tighter text-[#FF4D00]">LACROIX.</h1>
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Admin Panel</p>
          </div>

          <nav className="space-y-2">
            {(["ALUMNOS", "POSTS", "COMENTARIOS", "USUARIOS"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-widest flex justify-between items-center transition-all ${
                  tab === t
                    ? "bg-[#FF4D00] text-black font-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t}
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full ${
                    tab === t ? "bg-black text-[#FF4D00]" : "bg-white/10 text-white"
                  }`}
                >
                  {t === "ALUMNOS"
                    ? alumnos.length
                    : t === "POSTS"
                    ? posts.length
                    : t === "COMENTARIOS"
                    ? comentarios.length
                    : usuariosDjango.length}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-8 bg-[#181818] border border-white/5 rounded-2xl p-4">
            <p className="text-[10px] tracking-widest text-white/40 uppercase font-bold">INGRESOS MES</p>
            <p className="text-2xl font-black text-[#FF4D00] mt-1">${ingresos.toLocaleString()}</p>
            <p className="text-[10px] text-white/30 mt-1">{activos} activos • {vencidos} vencidos</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-xs font-black text-white/80 uppercase">ADMIN: {user}</p>
          <button
            onClick={logout}
            className="mt-3 w-full border border-white/20 text-[10px] tracking-widest py-2 rounded-xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all font-bold"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* Área de Contenido */}
      <main className="flex-1 bg-[#101010] border border-white/10 rounded-2xl p-6 md:p-8 overflow-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">{tab}</h2>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">
              {tab === "ALUMNOS" && `${activos} alumnos activos registrados`}
              {tab === "POSTS" && `${posts.length} artículos publicados en el blog`}
              {tab === "COMENTARIOS" && `${comentarios.length} comentarios moderables`}
              {tab === "USUARIOS" && `${usuariosDjango.length} usuarios sincronizados en Django`}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-[#181818] border border-white/10 px-4 py-2 rounded-full">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-bold tracking-widest text-green-400">DJANGO ONLINE</p>
          </div>
        </div>

        {/* TAB ALUMNOS */}
        {tab === "ALUMNOS" && (
          <div className="space-y-6">
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-3">
              <input
                value={alumnoNombre}
                onChange={(e) => setAlumnoNombre(e.target.value)}
                placeholder={editingAlumnoId ? "Editando nombre del alumno..." : "Nombre y apellido del alumno"}
                className={`flex-1 bg-[#101010] border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#FF4D00] ${
                  editingAlumnoId ? "border-[#FF4D00] text-[#FF4D00]" : "border-white/10 text-white"
                }`}
              />
              <select
                value={alumnoPlan}
                onChange={(e) => setAlumnoPlan(e.target.value)}
                className="bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none"
              >
                <option value="BEAST">BEAST</option>
                <option value="BEAST PRO">BEAST PRO</option>
                <option value="STARTER">STARTER</option>
              </select>
              <select
                value={alumnoEstado}
                onChange={(e) => setAlumnoEstado(e.target.value)}
                className="bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="VENCIDO">VENCIDO</option>
              </select>
              <button
                onClick={guardarAlumno}
                className="bg-[#FF4D00] text-black font-black px-6 py-3 rounded-xl text-xs hover:bg-white transition-all uppercase"
              >
                {editingAlumnoId ? "Guardar" : "+ Agregar"}
              </button>
              {editingAlumnoId && (
                <button
                  onClick={() => {
                    setEditingAlumnoId(null);
                    setAlumnoNombre("");
                  }}
                  className="border border-white/20 px-4 py-3 rounded-xl text-xs hover:bg-white/10"
                >
                  X
                </button>
              )}
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 text-[10px] font-bold tracking-widest text-white/40 p-4 border-b border-white/10 bg-white/5 uppercase">
                <span className="col-span-4">Alumno</span>
                <span className="col-span-2">Plan</span>
                <span className="col-span-2">Estado</span>
                <span className="col-span-2">Progreso</span>
                <span className="col-span-2 text-right">Acción</span>
              </div>
              {alumnos.map((a) => (
                <div
                  key={a.id}
                  className={`grid grid-cols-12 items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 text-xs transition-colors ${
                    editingAlumnoId === a.id ? "bg-[#FF4D00]/10" : ""
                  }`}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FF4D00]/20 border border-[#FF4D00]/40 flex items-center justify-center font-bold text-[#FF4D00] text-xs">
                      {a.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{a.nombre}</p>
                      <p className="text-[10px] text-white/40">{a.email}</p>
                    </div>
                  </div>
                  <span className="col-span-2 text-[10px] bg-white/10 px-2.5 py-1 rounded-md w-fit font-semibold">
                    {a.plan}
                  </span>
                  <span
                    className={`col-span-2 text-[10px] px-2.5 py-1 rounded-md font-bold w-fit ${
                      a.estado === "ACTIVO" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {a.estado}
                  </span>
                  <div className="col-span-2 pr-4">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF4D00]" style={{ width: `${a.progreso}%` }}></div>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button
                      onClick={() => startEditAlumno(a)}
                      className="text-[10px] bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`¿Eliminar alumno ${a.nombre}?`)) {
                          await fetch(`${API}/usuarios/${a.id}/`, {
                            method: "DELETE",
                            headers: getHeaders(),
                          });
                          load();
                        }
                      }}
                      className="text-[10px] bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-all font-bold"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB POSTS */}
        {tab === "POSTS" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-[#181818] border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="font-black text-sm uppercase text-[#FF4D00]">
                {editingId ? "Editar Post" : "Nuevo Artículo"}
              </h3>
              <form onSubmit={handleSubmitPost(onSubmitPost)} className="mt-4 space-y-4">
                <div>
                  <input
                    {...registerPost("titulo")}
                    placeholder="Título del post"
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4D00]"
                  />
                  {postErrors.titulo && (
                    <span className="text-red-400 text-[10px] mt-1 block">{postErrors.titulo.message}</span>
                  )}
                </div>
                <div>
                  <textarea
                    {...registerPost("contenido")}
                    placeholder="Contenido principal del post..."
                    className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 h-32 text-xs text-white focus:outline-none focus:border-[#FF4D00]"
                  />
                  {postErrors.contenido && (
                    <span className="text-red-400 text-[10px] mt-1 block">{postErrors.contenido.message}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF4D00] text-black py-3 rounded-xl text-xs font-black hover:bg-white transition-all uppercase"
                >
                  {editingId ? "Guardar Cambios" : "+ Publicar Post"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      resetPostForm();
                    }}
                    className="w-full border border-white/20 text-white/60 py-2 rounded-xl text-xs hover:bg-white/10"
                  >
                    Cancelar
                  </button>
                )}
              </form>
            </div>

            <div className="md:col-span-2 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center p-5 border-b border-white/5 last:border-0 hover:bg-white/5"
                >
                  <div>
                    <p className="font-black uppercase text-xs text-white">{p.titulo}</p>
                    <p className="text-xs text-white/50 mt-1 line-clamp-1">{p.contenido}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setPostValue("titulo", p.titulo);
                        setPostValue("contenido", p.contenido);
                        setEditingId(p.id);
                      }}
                      className="text-[10px] bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("¿Borrar post?")) {
                          await fetch(`${API}/posts/${p.id}/`, {
                            method: "DELETE",
                            headers: getHeaders(),
                          });
                          load();
                        }
                      }}
                      className="text-[10px] bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/30"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB COMENTARIOS */}
        {tab === "COMENTARIOS" && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
            {comentarios.length === 0 ? (
              <div className="p-10 text-center text-white/40 text-xs">Aún no hay comentarios agregados.</div>
            ) : (
              comentarios.map((c) => (
                <div key={c.id} className="p-5 border-b border-white/5 last:border-0 hover:bg-white/5">
                  {editingCommentId === c.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="flex-1 bg-[#101010] border border-[#FF4D00] rounded-xl px-4 py-2 text-xs text-white outline-none"
                      />
                      <button
                        onClick={saveCommentEdit}
                        className="bg-[#FF4D00] text-black px-4 py-2 rounded-xl text-xs font-black"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="border border-white/20 px-3 py-2 rounded-xl text-xs"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-[#FF4D00] font-black tracking-widest uppercase">
                          POST #{c.postId} @ {c.autor?.username || "Anónimo"}
                        </p>
                        <p className="text-xs text-white/90 mt-1 italic">"{c.texto}"</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingCommentId(c.id);
                            setEditingCommentText(c.texto);
                          }}
                          className="text-[10px] bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="text-[10px] bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/30"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB USUARIOS */}
        {tab === "USUARIOS" && (
          <div className="space-y-4">
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] tracking-widest text-[#FF4D00] font-black uppercase">
                  Usuarios de Django REST Framework
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Peticiones directas enviadas hacia <span className="font-mono text-white">{API}/usuarios/</span>
                </p>
              </div>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
              {usuariosDjango.map((u: any) => (
                <div
                  key={u.id}
                  className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">
                        {u.username} {u.es_premium ? "⭐" : ""}{" "}
                        <span className="text-white/40 font-normal">({u.email})</span>
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {u.is_staff ? "STAFF / ADMIN" : "ALUMNO REGULAR"} • ID #{u.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-md font-bold ${
                        u.is_active !== false ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {u.is_active !== false ? "ACTIVO" : "INACTIVO"}
                    </span>
                    <button
                      onClick={() => borrarUsuarioDjango(u.id)}
                      className="text-[10px] bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/30"
                    >
                      Borrar en Django
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}