"use client"
import * as React from "react"
import { ShoppingCart, ArrowRight, Leaf, Zap, ChevronLeft } from "lucide-react"

const GRADE_STYLES: Record<string, any> = {
  "silver": { color: "#C1C1C1", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
  "golden": { color: "#FEC107", bg: "rgba(254,193,7,0.05)", border: "rgba(254,193,7,0.15)" },
  "premium": { color: "#34D399", bg: "rgba(52,211,153,0.05)", border: "rgba(52,211,153,0.15)" },
  "selected premium": { color: "#A855F7", bg: "rgba(168,85,247,0.05)", border: "rgba(168,85,247,0.15)" },
};

const DUMMY_DATA = [
  { id: "1", name: "Classic Bud", price: 50, category: "Buds", grade: "premium" },
  { id: "2", name: "Golden Kush", price: 80, category: "Buds", grade: "golden" },
  { id: "3", name: "Pro Grinder", price: 35, category: "Accessories", grade: "silver" },
];

export default function IndexPage() {
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCat, setActiveCat] = React.useState("Buds");

  if (view === "landing") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-8 bg-[#193D2E] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="w-56 h-56 mb-20 relative z-10 flex items-center justify-center bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)]">
           <span className="text-7xl font-black italic text-white tracking-tighter">BND</span>
        </div>
        
        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl relative z-10">
          {[
            { id: "Buds", icon: <Leaf size={48} />, label: "Buds" },
            { id: "Accessories", icon: <Zap size={48} />, label: "Gear" }
          ].map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => { setActiveCat(cat.id); setView("shop"); }} 
              className="aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4.5rem] hover:bg-white hover:text-[#193D2E] transition-all active:scale-90 group shadow-2xl"
              style={{ backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)' }}
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
              <span className="text-2xl font-black uppercase italic tracking-[0.2em]">{cat.label}</span>
              <ArrowRight size={24} className="mt-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-3 transition-all" />
            </button>
          ))}
        </div>
        <p className="mt-24 text-[10px] font-black uppercase tracking-[0.6em] text-white/20 italic">Premium Delivery Service</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto bg-[#193D2E] text-white pt-16">
      <div className="flex justify-between items-center mb-20">
        <button onClick={() => setView("landing")} className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
          <ChevronLeft size={16} /> Back
        </button>
        <span className="text-4xl font-black italic tracking-tighter">BND</span>
      </div>

      <h1 className="text-8xl font-black italic uppercase mb-16 tracking-tighter leading-none">
        {activeCat === "Accessories" ? "Gear" : activeCat}
      </h1>

      <div className="grid gap-10 pb-40">
        {DUMMY_DATA.filter(p => p.category === (activeCat === "Accessories" ? "Accessories" : "Buds")).map((p) => (
          <div 
            key={p.id} 
            className="p-12 rounded-[4rem] backdrop-blur-3xl transition-all border shadow-2xl group"
            style={{ 
                backgroundColor: GRADE_STYLES[p.grade]?.bg, 
                borderColor: GRADE_STYLES[p.grade]?.border,
                backdropFilter: 'blur(60px)',
                WebkitBackdropFilter: 'blur(60px)'
            }}
          >
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-5xl font-black italic mb-3 uppercase tracking-tighter leading-tight group-hover:translate-x-2 transition-transform">{p.name}</h3>
                <span style={{ color: GRADE_STYLES[p.grade]?.color }} className="text-xs font-black uppercase tracking-[0.4em]">
                  {p.grade}
                </span>
              </div>
              <p className="text-6xl font-black italic tracking-tighter text-white/90">${p.price}</p>
            </div>
            <button className="w-full py-8 bg-white text-[#193D2E] rounded-[2.5rem] font-black uppercase italic text-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:scale-[1.02] active:scale-95 transition-all">
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
