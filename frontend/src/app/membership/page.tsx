"use client";
import { useState } from "react";

const planes = [
  {
    id: "starter",
    nombre: "STARTER",
    precio: "15.000",
    ideal: "Para arrancar sin excusas",
    features: ["Acceso a musculación", "App Lacroix", "Rutina inicial", "1 clase de prueba"],
    no: ["Clases en vivo", "Coach personal"],
    popular: false,
    color: "border-white/10"
  },
  {
    id: "beast",
    nombre: "BEAST",
    precio: "25.000",
    ideal: "EL MÁS ELEGIDO - 80% lo elige",
    features: ["Todo lo de STARTER", "Clases ILIMITADAS", "BEAST + POWER + BURN", "Seguimiento nutricional", "Grupo WhatsApp privado", "Invitar a un amigo 1x mes"],
    no: [],
    popular: true,
    color: "border-[#FF4D00]"
  },
  {
    id: "pro",
    nombre: "BEAST PRO",
    precio: "38.000",
    ideal: "Para competir y no joder",
    features: ["Todo lo de BEAST", "2 sesiones PT al mes", "Plan nutricional 1 a 1", "Acceso 24/7 con llave", "Recuperación + crioterapia", "Remera oficial"],
    no: [],
    popular: false,
    color: "border-white/10"
  }
];

export default function Membership() {
  const [anual, setAnual] = useState(false);
  const [toast, setToast] = useState("");

  const handleBuy = (plan: string) => {
    setToast(`Reservando ${plan}... Te redirigimos a WhatsApp`);
    setTimeout(()=>setToast(""), 2500);
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-3 rounded-full text-xs font-black border-2 border-[#FF4D00] animate-bounce">{toast}</div>}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-[#FF4D00] text-xs tracking-[0.5em] font-bold">MEMBERSHIP / 2025</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mt-3">ELEGÍ TU<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] to-orange-300">NIVEL BEAST</span></h1>
            <p className="text-white/40 text-sm mt-4 max-w-md">Sin contrato de 12 meses. Sin letra chica. Cancelás cuando querés. Pero no vas a querer.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#101010] border border-white/10 rounded-full p-1.5">
            <button onClick={()=>setAnual(false)} className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-colors ${!anual ? "bg-white text-black" : "text-white/40"}`}>MENSUAL</button>
            <button onClick={()=>setAnual(true)} className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-colors ${anual ? "bg-[#FF4D00] text-black" : "text-white/40"}`}>ANUAL -20%</button>
          </div>
        </div>

        {/* COMPARATIVA RAPIDA */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 text-[10px] tracking-widest">
          <span className="text-white/30">INCLUYE EN TODOS:</span>
          <span>✓ DUCHAS</span><span>✓ LOCKERS</span><span>✓ WIFI</span><span>✓ ESTACIONAMIENTO</span><span>✓ APP</span>
        </div>

        {/* PLANES */}
        <div className="grid md:grid-cols-3 gap-5 mt-12 items-stretch">
          {planes.map((p) => (
            <div key={p.id} className={`relative bg-[#101010] rounded-[2rem] border-2 ${p.color} p-8 flex flex-col ${p.popular ? "scale-105 bg-[#141414] shadow-[0_0_50px_rgba(255,77,0,0.15)]" : ""}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF4D00] text-black text-[10px] font-black tracking-widest px-4 py-1 rounded-full">MÁS POPULAR • MÁS POPULAR</div>}
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">{p.nombre}</h3>
                  <p className="text-[10px] tracking-widest text-[#FF4D00] mt-1 font-bold">{p.ideal}</p>
                </div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xs">{p.id==="starter" ? "01" : p.id==="beast" ? "02" : "03"}</div>
              </div>

              <div className="mt-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-white/40">$</span>
                  <span className="text-5xl font-black tracking-tighter">{anual ? (parseInt(p.precio.replace(".",""))*0.8/1000).toFixed(0)+".000" : p.precio}</span>
                  <span className="text-sm text-white/40">/mes</span>
                </div>
                {anual && <p className="text-[10px] text-[#FF4D00] mt-1 tracking-widest">AHORRÁS ${(parseInt(p.precio.replace(".",""))*0.2).toLocaleString()} AL AÑO</p>}
              </div>

              <div className="mt-8 space-y-3 flex-1">
                {p.features.map((f, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 bg-[#FF4D00] text-black rounded-full flex items-center justify-center text-[10px] font-black mt-0.5">✓</div>
                    <p className="text-sm text-white/70 leading-tight">{f}</p>
                  </div>
                ))}
                {p.no.map((f, i) => (
                  <div key={i} className="flex gap-3 items-start opacity-30">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px]">✕</div>
                    <p className="text-sm line-through">{f}</p>
                  </div>
                ))}
              </div>

              <button onClick={()=>handleBuy(p.nombre)} className={`mt-8 w-full py-4 rounded-full text-xs font-black tracking-widest transition-colors ${p.popular ? "bg-[#FF4D00] text-black hover:bg-white" : "bg-white text-black hover:bg-[#FF4D00]"}`}>
                ELEGIR {p.nombre} →
              </button>
              <p className="text-[10px] text-white/20 tracking-widest text-center mt-3">SIN PERMANENCIA • CANCELÁS EN 1 CLICK</p>
            </div>
          ))}
        </div>

        {/* FAQ Y GARANTIA */}
        <div className="grid md:grid-cols-2 gap-6 mt-20">
          <div className="bg-white text-black rounded-[2rem] p-8">
            <h3 className="text-2xl font-black tracking-tighter">¿Y SI NO ME GUSTA?</h3>
            <p className="text-sm mt-3 opacity-70 leading-relaxed">Tenés 7 días de garantía. Venís, probás todo. Si no te sentís más fuerte, más enfocado y parte de algo, te devolvemos todo. Sin preguntas.</p>
            <div className="mt-6 flex gap-2">
              <img src="https://i.pravatar.cc/32?img=5" className="w-8 h-8 rounded-full border-2 border-white" alt=""/>
              <img src="https://i.pravatar.cc/32?img=6" className="w-8 h-8 rounded-full border-2 border-white -ml-2" alt=""/>
              <img src="https://i.pravatar.cc/32?img=7" className="w-8 h-8 rounded-full border-2 border-white -ml-2" alt=""/>
              <p className="text-[11px] ml-2 font-bold">+500 BEASTS NO SE EQUIVOCAN</p>
            </div>
          </div>
          <div className="bg-[#101010] border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-black">PREGUNTAS RÁPIDAS</h3>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-white/40">¿Hay matrícula?</span><span className="font-bold">No, nunca.</span></div>
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-white/40">¿Puedo congelar?</span><span className="font-bold">Sí, 1 mes al año gratis.</span></div>
              <div className="flex justify-between"><span className="text-white/40">¿Horarios?</span><span className="font-bold">Lun a Vie 6hs a 22hs / Sáb 8hs a 14hs</span></div>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-12 bg-[#FF4D00] rounded-[2rem] p-8 text-center relative overflow-hidden">
          <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-black/10 leading-none pointer-events-none">BEAST</h2>
          <div className="relative">
            <h2 className="text-black text-4xl font-black tracking-tighter">¿TODAVÍA LO ESTÁS PENSANDO?</h2>
            <p className="text-black/70 text-sm mt-2">Mientras pensás, otros están levantando más que vos.</p>
            <a href="https://wa.me/54358XXXXXXXX" className="inline-block mt-6 bg-black text-white px-8 py-4 rounded-full text-xs font-black tracking-widest">HABLAR POR WHATSAPP →</a>
          </div>
        </div>

      </div>
    </div>
  );
} 