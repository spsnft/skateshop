"use client"
// BND-UPDATE-V10: Grid Home Layout, New Glass Styles, Background #193D2E
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"
import { 
  ShoppingCart, X, Trash2, Info, CheckCircle2, ArrowRight, Leaf, Zap, Phone
} from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// --- CONFIG ---
const TG_TOKEN = process.env.NEXT_PUBLIC_TG_TOKEN;
const TG_CHAT_ID = process.env.NEXT_PUBLIC_TG_CHAT_ID;

const GRADE_STYLES: Record<string, any> = {
  "silver": { color: "#C1C1C1", bg: "bg-white/5", border: "border-white/10" },
  "golden": { color: "#FEC107", bg: "bg-[#FEC107]/5", border: "border-[#FEC107]/20" },
  "premium": { color: "#34D399", bg: "bg-[#34D399]/10", border: "border-[#34D399]/20" },
  "selected premium": { color: "#A855F7", bg: "bg-[#A855F7]/10", border: "border-[#A855F7]/20" },
};

const getImageUrl = (path: string) => {
  if (!path) return '/product-placeholder.webp';
  return path.startsWith('http') ? path : `/images/${path}`;
}

// --- STORE ---
interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string, weight: any) => void;
  clearCart: () => void;
}
const useCart = create<CartStore>()(persist((set) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const ex = state.items.find(i => i.id === newItem.id && i.weight === newItem.weight);
    if (ex) return { items: state.items.map(i => i === ex ? { ...i, quantity: i.quantity + 1 } : i) };
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),
  removeItem: (id, weight) => set((state) => ({
    items: state.items.filter(i => !(i.id === id && i.weight === weight))
  })),
  clearCart: () => set({ items: [] })
}), { name: "bnd-cart-v6" }));

// --- MAIN COMPONENT ---
export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCategory, setActiveCategory] = React.useState("Buds");
  const [activeSubcat, setActiveSubcat] = React.useState("All Grades");
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const { items, clearCart } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  React.useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#193D2E] flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Фоновое свечение */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <img src="/images/logo-optimized.webp" alt="BND" className="w-48 h-48 object-contain mb-16 relative z-10 drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]" />
        
        {/* Квадратные кнопки "Лево-Право" */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg relative z-10">
          {[
            { id: "Buds", icon: <Leaf size={32} />, label: "Buds" },
            { id: "Accessories", icon: <Zap size={32} />, label: "Gear" }
          ].map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => { setActiveCategory(cat.id); setView("shop"); window.scrollTo(0,0); }} 
              className="aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] hover:bg-white hover:text-black transition-all active:scale-95 group shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-black/5 transition-colors">
                {cat.icon}
              </div>
              <span className="text-xl font-black uppercase italic tracking-widest">{cat.label}</span>
              <ArrowRight size={20} className="mt-4 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </div>

        <p className="mt-16 text-[8px] font-black uppercase tracking-[0.5em] text-white/10 italic">Premium Delivery Service</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#193D2E] text-white pb-24">
      {/* Здесь остается твой текущий код магазина (header, фильтры, карточки), который мы уже отладили */}
    </div>
  );
}
