"use client"
import * as React from "react"
import { ShoppingCart, ArrowRight, Leaf, Zap, ChevronLeft } from "lucide-react"

const GRADE_STYLES: Record<string, any> = {
  "silver": { color: "#C1C1C1", bg: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  "golden": { color: "#FEC107", bg: "rgba(254,193,7,0.1)", border: "1px solid rgba(254,193,7,0.2)" },
  "premium": { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" },
  "selected premium": { color: "#A855F7", bg: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" },
};

const DUMMY_DATA = [
  { id: "1", name: "Premium Bud", price: 50, category: "Buds", grade: "premium" },
  { id: "2", name: "Golden Kush", price: 80, category: "Buds", grade: "golden" },
  { id: "3", name: "Pro Grinder", price: 35, category: "Accessories", grade: "silver" },
];

export default function IndexPage() {
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCat, setActiveCat] = React.useState("Buds");

  if (view === "landing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-[#193D2E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.2)_0%,transparent_70%)]" />
        
        <div className="w-48 h-48 mb-16 relative z-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
           <span className="text-6xl font-black italic text-white tracking-tighter">BND</span>
        </div>
        
        <div className="grid grid-cols-2 gap-8 w-full max-w-xl relative z-10">
          {[
            { id: "Buds", icon: <Leaf size={48} />, label: "Buds" },
            { id: "Accessories", icon: <Zap size={48} />, label: "Gear" }
          ].map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => { setActiveCat(cat.id); setView("shop"); }} 
              className="aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] hover:bg-white hover:text-[#193D2E] transition-all active:scale-95 group shadow-2xl"
              style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <span className="text-2xl font-black uppercase italic tracking-widest">{cat.label}</span>
              <ArrowRight size={24} className="mt-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </button>
          ))}
        </div>
        <p className="mt-20 text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Premium Delivery Service</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto bg-[#193D2E] text-white">
      <div className="flex justify-between items-center mb-16">
        <button onClick={() => setView("landing")} className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all">
          <ChevronLeft size={16} /> Back
        </button>
        <span className="text-3xl font-black italic tracking-tighter">BND</span>
      </div>

      <h1 className="text-7xl font-black italic uppercase mb-12 tracking-tighter">
        {activeCat === "Accessories" ? "Gear" : activeCat}
      </h1>

      <div className="grid gap-8 pb-32">
        {DUMMY_DATA.filter(p => p.category === (activeCat === "Accessories" ? "Accessories" : "Buds")).map((p) => (
          <div 
            key={p.id} 
            className="p-10 rounded-[3.5rem] backdrop-blur-3xl transition-all"
            style={{ 
                backgroundColor: GRADE_STYLES[p.grade]?.bg, 
                border: GRADE_STYLES[p.grade]?.border,
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)'
            }}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-4xl font-black italic mb-2 uppercase tracking-tight">{p.name}</h3>
                <span style={{ color: GRADE_STYLES[p.grade]?.color }} className="text-xs font-black uppercase tracking-[0.3em]">
                  {p.grade}
                </span>
              </div>
              <p className="text-5xl font-black italic tracking-tighter">${p.price}</p>
            </div>
            <button className="w-full py-6 bg-white text-[#193D2E] rounded-[2rem] font-black uppercase italic text-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-[1.03] active:scale-95 transition-all">
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
