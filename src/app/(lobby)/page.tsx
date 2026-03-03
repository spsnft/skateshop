"use client"
import * as React from "react"
import { 
  ShoppingCart, X, Trash2, Info, CheckCircle2, ArrowRight, Leaf, Zap, Phone
} from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// --- ДАННЫЕ ТОВАРОВ (Временно здесь, чтобы билд не падал) ---
const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Classic Bud",
    price: 50,
    category: "Buds",
    image: "bud-1.webp",
    grade: "premium"
  },
  {
    id: "p2",
    name: "Golden Gear",
    price: 35,
    category: "Accessories",
    image: "gear-1.webp",
    grade: "golden"
  }
];

// --- STORE ---
interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const useCart = create<CartStore>()(persist((set) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const ex = state.items.find(i => i.id === newItem.id);
    if (ex) return { items: state.items.map(i => i === ex ? { ...i, quantity: i.quantity + 1 } : i) };
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
  clearCart: () => set({ items: [] })
}), { name: "bnd-cart-v7" }));

export default function IndexPage() {
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCategory, setActiveCategory] = React.useState("Buds");
  
  const { items, addItem, removeItem } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Фильтруем товары по выбранной кнопке (Buds или Gear)
  const displayProducts = INITIAL_PRODUCTS.filter(p => p.category === activeCategory);

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#193D2E] flex flex-col items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="w-48 h-48 mb-16 relative z-10 flex items-center justify-center bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 shadow-2xl">
           <span className="text-5xl font-black italic tracking-tighter text-white">BND</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg relative z-10">
          {[
            { id: "Buds", icon: <Leaf size={32} />, label: "Buds" },
            { id: "Accessories", icon: <Zap size={32} />, label: "Gear" }
          ].map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => { setActiveCategory(cat.id); setView("shop"); window.scrollTo(0,0); }} 
              className="aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:bg-white hover:text-[#193D2E] transition-all active:scale-95 group shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-black/5 transition-colors">
                {cat.icon}
              </div>
              <span className="text-xl font-black uppercase italic tracking-widest">{cat.label}</span>
              <ArrowRight size={20} className="mt-4 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </div>

        <p className="mt-16 text-[8px] font-black uppercase tracking-[0.5em] text-white/20 italic">Premium Delivery Service</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#193D2E] text-white p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
          <ArrowRight size={14} className="rotate-180" /> Back
        </button>
        <span className="text-xl font-black italic">BND</span>
      </div>

      <h1 className="text-5xl font-black italic uppercase mb-8 tracking-tighter">{activeCategory === "Accessories" ? "Gear" : activeCategory}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
        {displayProducts.map((product) => (
          <div key={product.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-3xl relative overflow-hidden group">
            <div className="aspect-square bg-black/20 rounded-3xl mb-6 flex items-center justify-center text-white/5 italic overflow-hidden">
               {/* Здесь будут картинки из /public/images/ */}
               <span className="group-hover:scale-110 transition-transform duration-500">{product.image}</span>
            </div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">{product.name}</h3>
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-wider">{product.grade}</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-3xl font-black text-emerald-400">${product.price}</p>
              <button 
                onClick={() => addItem(product)}
                className="px-8 py-4 bg-white text-[#193D2E] rounded-2xl font-black uppercase italic hover:scale-105 transition-all active:scale-95 shadow-xl"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md bg-white text-[#193D2E] p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center z-50 animate-in fade-in slide-in-from-bottom-4">
          <div>
            <p className="text-[10px] font-black uppercase opacity-40">Total Amount</p>
            <p className="text-2xl font-black italic">${totalPrice}</p>
          </div>
          <button className="bg-[#193D2E] text-white px-10 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2 hover:opacity-90 transition-opacity">
            Checkout <ShoppingCart size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
