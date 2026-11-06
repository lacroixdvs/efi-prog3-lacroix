"use client";
import { useEffect, useState } from "react";

const slides = [
  { id: 1, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920", title: "TRAIN", accent: "BEAST", sub: "RIO CUARTO • ARG" },
  { id: 2, img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1920", title: "LIFT", accent: "HEAVY", sub: "POWERLIFTING CLUB" },
  { id: 3, img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1920", title: "NO", accent: "LIMITS", sub: "24/7 ACCESS" }
];

const clasesEnVivo = [
  { id: 1, hora: "07:00", nombre: "BEAST MORNING", coach: "NICO", tipo: "CROSSFIT", estado: "LIVE", cupos: 14, total: 20, img: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=400" },
  { id: 2, hora: "18:00", nombre: "POWER HOUR", coach: "LUCIA", tipo: "POWERLIFTING", estado: "NEXT", cupos: 8, total: 15, img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400" },
  { id: 3, hora: "19:30", nombre: "HYROX BURN", coach: "MARCOS", tipo: "FUNCIONAL", estado: "FULL", cupos: 20, total: 20, img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400" },
  { id: 4, hora: "20:30", nombre: "BEAST NIGHT", coach: "NICO", tipo: "CROSSFIT", estado: "OPEN", cupos: 5, total: 20, img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400" },
];

const coaches = [
  { name: "NICO LACROIX", role: "HEAD COACH / OWNER", goal: "Fuerza total y mentalidad. 8 años formando atletas que no abandonan.", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800" },
  { name: "LUCIA FERREYRA", role: "STRENGTH COACH", goal: "Que levantes pesado sin miedo. Técnica impecable, glúteos y confianza.", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800" },
  { name: "MARCOS PAZ", role: "ENDURANCE / HYROX", goal: "Motor infinito. Te preparo para competir y no morir en el intento.", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800" },
];

export default function HomeFinal() {
  const [posts, setPosts] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const d = localStorage.getItem("lacroix_posts_demo");
    let f: any[] = d ? JSON.parse(d) : [
      { id: 101, titulo: "PR DE SENTADILLA", contenido: "Como pasé de 100 a 180kg...", categoria: "STRENGTH" },
      { id: 102, titulo: "MEAL PREP BEAST", contenido: "5 comidas en 1 hora...", categoria: "NUTRITION" },
      { id: 103, titulo: "DISCIPLINA > MOTIVACIÓN", contenido: "El mindset que cambia todo...", categoria: "MINDSET" },
    ];
    setPosts(Array.from(new Map(f.map((p:any) => [p.id, p])).values()).slice(0,3));
  }, []);

  const showToast = (name: string, app: string) => {
    setToast(`${app}: Conectando con ${name}...`);
    setTimeout(()=>setToast(""), 2500);
  };

  return (
    <div className="bg-[#080808] text-white">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-3 rounded-full text-xs font-black tracking-widest border-2 border-[#FF4D00] animate-bounce">{toast}</div>}

      <div className="relative h-[92vh] w-full overflow-hidden">
        {slides.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-all duration-[1.5s] ${i===current ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}>
            <img src={s.img} className="h-full w-full object-cover" alt=""/>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
          </div>
        ))}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-[#FF4D00] rounded-full animate-ping"></span>
              <p className="text-[10px] tracking-[0.3em]">EN VIVO • {slides[current].sub}</p>
            </div>
            <h1 className="text-[18vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter mt-6">{slides[current].title}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] to-orange-300">{slides[current].accent}</span></h1>
            <div className="flex gap-3 mt-8">
              <a href="/membership" className="bg-white text-black px-8 py-4 text-xs font-black">UNITE AHORA →</a>
              <a href="/login" className="bg-white/10 border border-white/20 px-8 py-4 text-xs">SOY ALUMNO</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FF4D00] text-black py-3 overflow-hidden whitespace-nowrap">
        <div className="animate-[marquee_20s_linear_infinite] flex gap-8 text-sm font-black tracking-widest">
          <span>★ LACROIX FITNESS ★ CLASES EN VIVO ★ NO PAIN NO GAIN ★</span>
          <span>★ LACROIX FITNESS ★ CLASES EN VIVO ★ NO PAIN NO GAIN ★</span>
          <span>★ LACROIX FITNESS ★ CLASES EN VIVO ★ NO PAIN NO GAIN ★</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-[#FF4D00] text-xs tracking-[0.4em] font-bold">LIVE SCHEDULE / HOY</p>
        </div>
        <h2 className="text-6xl font-black tracking-tighter leading-[0.9] mt-2">CLASES<br/><span className="text-white/20">EN VIVO</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {clasesEnVivo.map((c) => (
            <div key={c.id} className="group relative bg-[#101010] border border-white/10 rounded-[1.5rem] overflow-hidden hover:border-[#FF4D00]/50 transition-colors">
              <div className="relative h-32 overflow-hidden">
                <img src={c.img} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt=""/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${c.estado==="LIVE" ? "bg-red-500 text-white animate-pulse" : c.estado==="FULL" ? "bg-white/20 text-white" : "bg-[#FF4D00] text-black"}`}>{c.estado}</span>
                  <span className="text-[10px] bg-black/60 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-full">{c.hora}HS</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] tracking-widest text-white/40">{c.tipo} • COACH {c.coach}</p>
                <h3 className="font-black text-lg leading-none mt-1">{c.nombre}</h3>
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-white/40"><span>OCUPACIÓN</span><span>{c.cupos}/{c.total}</span></div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-[#FF4D00] rounded-full" style={{width:`${(c.cupos/c.total)*100}%`}}></div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COACHES ARREGLADOS */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-6xl font-black tracking-tighter leading-[0.9]">COACHES<br/><span className="text-white/20">BEAST TEAM</span></h2>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {coaches.map((c,i) => (
            <div key={i} className="group relative overflow-hidden rounded-[1.8rem] h-[520px] border border-white/10 bg-[#101010]">
              <img src={c.img} className="h-[60%] w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={c.name}/>
              <div className="absolute top-[60%] inset-x-0 h-[40%] bg-gradient-to-t from-black via-[#101010] to-transparent -mt-20 pointer-events-none" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>showToast(c.name, "Instagram")} className="w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-[#FF4D00] hover:text-black text-xs">IG</button>
                <button onClick={()=>showToast(c.name, "WhatsApp")} className="w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-[#FF4D00] hover:text-black text-xs">WA</button>
                <button onClick={()=>showToast(c.name, "Email")} className="w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-[#FF4D00] hover:text-black text-xs">@</button>
              </div>
              <div className="absolute bottom-0 p-6">
                <p className="text-[#FF4D00] text-[10px] tracking-[0.3em] font-bold">{c.role}</p>
                <h3 className="font-black text-2xl mt-1 tracking-tighter">{c.name}</h3>
                <p className="text-sm text-white/60 mt-3 leading-snug">"{c.goal}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BLOG */}
      <div className="bg-white text-black py-24 rounded-t-[2.5rem]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black tracking-tighter">BEAST BLOG</h2>
          <div className="grid md:grid-cols-3 gap-[1px] bg-black/10 mt-10 border border-black/10 rounded-2xl overflow-hidden">
            {posts.map((p,i) => (
              <a key={`${p.id}-${i}`} href={`/blog/${p.id}`} className="bg-white p-8 group hover:bg-black hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FF4D00] text-black flex items-center justify-center font-black">{i+1}</div>
                <h3 className="font-black text-xl uppercase mt-6">{p.titulo}</h3>
                <p className="text-sm opacity-60 mt-2 line-clamp-2">{p.contenido}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* NUEVO FINAL PARA QUE QUEDE LISTO - CTA + FOOTER */}
      <div className="bg-[#080808] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-[#FF4D00] rounded-[2rem] p-10 md:p-16 relative overflow-hidden">
            <h2 className="absolute -top-6 -left-4 text-[20vw] font-black text-black/10 leading-none pointer-events-none">BEAST</h2>
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-black text-xs tracking-[0.4em] font-bold">ÚLTIMOS CUPOS 2025</p>
                <h2 className="text-black text-5xl md:text-6xl font-black leading-[0.9] mt-2 tracking-tighter">¿TE VAS A<br/>QUEDAR MIRANDO?</h2>
                <p className="text-black/60 text-sm mt-4 max-w-sm">Probá una clase gratis. Sin compromiso. Si no te gusta, te vas. Pero te vas a quedar.</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="/membership" className="bg-black text-white px-10 py-5 text-sm font-black tracking-widest rounded-full text-center hover:bg-white hover:text-black transition-colors">QUIERO SER BEAST →</a>
                <p className="text-black/60 text-[10px] tracking-widest text-center">+500 ALUMNOS • 4.9★ EN GOOGLE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] tracking-[0.4em] text-white/30">LACROIX FITNESS © 2025 • RIO CUARTO, CBA • NO PAIN NO GAIN</p>
            <div className="flex gap-6 text-[10px] tracking-widest text-white/40">
              <span>INSTAGRAM</span><span>WHATSAPP</span><span>TIKTOK</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div> 
  );
}