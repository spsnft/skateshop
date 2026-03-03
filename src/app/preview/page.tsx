"use client"
import * as React from "react"
import { ShoppingCart, ArrowRight, Leaf, Zap } from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// --- ЦВЕТА ГРЕЙДОВ (Та самая красота) ---
const GRADE_STYLES: Record<string, any> = {
  "silver": { color: "#C1C1C1", bg: "bg-white/5", border: "border-white/10" },
  "golden": { color: "#FEC107", bg: "bg-[#FEC107]/10", border: "border-[#FEC107]/20" },
  "premium": { color: "#34D399", bg: "bg-[#34D399]/10", border: "border-[#34D399]/20" },
  "selected premium": { color: "#A855F7", bg: "bg-[#A855F7]/10", border: "border-[#A855F7]/20" },
};

// --- ТВОИ ТОВАРЫ (Впиши сюда данные из своей таблицы) ---
const PRODUCTS = [
  { id: "1", name: "Classic Green", price: 50, category: "Buds", subcat: "Silver", grade: "silver" },
  { id: "2", name: "Golden Kush", price: 80, category: "Buds", subcat: "Golden", grade: "golden" },
  { id: "3", name: "Purple Dream", price: 120, category: "Buds", subcat: "Premium", grade: "selected premium" },
  { id: "4", name: "Grinder V2", price: 25, category: "Accessories", subcat: "Gear", grade: "silver" },
];

interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  clearCart: () => void;
}
const useCart = create<CartStore>()(persist((set) => ({
  items: [],
  addItem: (newItem) => set((state) => ({ items: [...state.items, newItem] })),
  clearCart: () => set({ items: [] })
}), { name: "bnd-final-cart" }));

export default function IndexPage() {
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [category, setCategory] = React.useState("Buds");
  const [subcat, setSubcat] = React.useState("All Grades");
  const { items, addItem } = useCart();

  const filtered = PRODUCTS.filter(p => p.category === category && (subcat === "All Grades" || p.subcat === subcat));

  if (view === "landing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#193D2E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.15)_0%,transparent_70%)]" />
        
        <div className="w-40 h-40 mb-12 relative z-10 flex items-center justify-center bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
           <span className="text-5xl font-black italic text-white tracking-tighter">BND</span>
        </div>
        
        <div className="grid grid-cols-2 gap-6 w-full max-w-md relative z-10">
          {[
            { id: "Buds", icon: <Leaf size={32} />, label: "Buds" },
            { id: "Accessories", icon: <Zap size={32} />, label: "Gear" }
          ].map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => { setCategory(cat.id); setView("shop"); }} 
              className="aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] hover:bg-white hover:text-[#193D2E] transition-all active:scale-95 group shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#193D2E]/10 transition-colors">
                {cat.icon}
              </div>
              <span className="text-lg font-black uppercase italic tracking-widest">{cat.label}</span>
              <ArrowRight size={18} className="mt-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
        <p className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Premium Service</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto bg-[#193D2E]">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => setView("landing")} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all flex items-center gap-2">
          <ArrowRight size={12} className="rotate-180" /> Back
        </button>
        <span className="text-xl font-black italic">BND</span>
      </div>

      <h1 className="text-5xl font-black italic uppercase mb-8 tracking-tighter">{category}</h1>

      {/* ФИЛЬТРЫ ГРЕЙДОВ */}
      <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar">
        {["All Grades", "Silver", "Golden", "Premium"].map((s) => (
          <button 
            key={s} onClick={() => setSubcat(s)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${subcat === s ? 'bg-white text-[#193D2E] border-white' : 'bg-white/5 border-white/10 opacity-50'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* СЕТКА ТОВАРОВ */}
      <div className="grid grid-cols-1 gap-6 pb-32">
        {filtered.map((p) => (
          <div key={p.id} className={`p-6 rounded-[2.5rem] border backdrop-blur-3xl ${GRADE_STYLES[p.grade]?.bg} ${GRADE_STYLES[p.grade]?.border}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
              <span style={{ color: GRADE_STYLES[p.grade]?.color }} className="text-[10px] font-black uppercase tracking-widest">{p.grade}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black italic">${p.price}</p>
              <button onClick={() => addItem(p)} className="px-8 py-4 bg-white text-[#193D2E] rounded-2xl font-black uppercase italic hover:scale-105 active:scale-95 transition-all shadow-xl">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto bg-white text-[#193D2E] p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center z-50 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-2xl font-black italic">${items.reduce((a, b) => a + b.price, 0)}</p>
          <button className="bg-[#193D2E] text-white px-10 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2">
            Order <ShoppingCart size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
