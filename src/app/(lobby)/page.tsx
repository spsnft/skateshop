"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"
import { 
  ShoppingCart, 
  Trash2, 
  X, 
  Plus, 
  Minus, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  Leaf,
  Droplets,
  Zap
} from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { motion, AnimatePresence } from "framer-motion"

// --- CONFIG ---
const TG_TOKEN = process.env.NEXT_PUBLIC_TG_TOKEN;
const TG_CHAT_ID = process.env.NEXT_PUBLIC_TG_CHAT_ID;

const GRADE_STYLES: Record<string, any> = {
  "silver grade": { color: "#C1C1C1", bg: "bg-white/5", border: "border-white/10" },
  "golden grade": { color: "#FEC107", bg: "bg-[#FEC107]/5", border: "border-[#FEC107]/20" },
  "premium grade": { color: "#34D399", bg: "bg-[#193D2E]/20", border: "border-[#34D399]/30" },
  "hash old school": { color: "#D2B48C", bg: "bg-[#402917]/30", border: "border-[#402917]/40" },
  "live rosin premium": { color: "#A855F7", bg: "bg-[#693A7B]/30", border: "border-[#693A7B]/40" },
};

const getImageUrl = (path: string) => {
  if (!path) return '/product-placeholder.webp';
  return path.startsWith('http') ? path : `/images/${path.split('/').pop()}`;
}

// --- КОРЗИНА ---
interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, delta: number) => void;
  clearCart: () => void;
}
const useCart = create<CartStore>()(persist((set) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const ex = state.items.find(i => i.id === newItem.id && i.weight === newItem.weight);
    if (ex) return { items: state.items.map(i => i === ex ? { ...i, quantity: i.quantity + 1 } : i) };
    return { items: [...state.items, newItem] };
  }),
  removeItem: (id, weight) => set((state) => ({ items: state.items.filter(i => !(i.id === id && i.weight === weight)) })),
  updateQuantity: (id, weight, delta) => set((state) => ({
    items: state.items.map(i => (i.id === id && i.weight === weight) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
  })),
  clearCart: () => set({ items: [] })
}), { name: "bnd-cart-v2" }));

// --- ПОЛНАЯ КАРТОЧКА ---
function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [weight, setWeight] = React.useState("1");
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCart(s => s.addItem);
  const style = GRADE_STYLES[String(product.subcategory || "").toLowerCase().trim()] || { color: "#34D399", bg: "bg-white/5", border: "border-white/10" };
  const price = product.prices?.[weight] || product.price;

  return (
    <div className={`relative flex flex-col rounded-[2rem] border p-3 backdrop-blur-xl ${style.bg} ${style.border}`}>
      <button onClick={() => onOpen(product)} className="absolute top-5 right-5 z-20 p-2 bg-black/40 rounded-full text-white/40"><Info size={14} /></button>
      <div className="aspect-square relative overflow-hidden rounded-[1.6rem] bg-black/60 mb-4 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-contain" loading="lazy" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
      </div>
      <div className="px-1 flex-1 text-left">
        <h3 className="font-bold text-white/90 text-[12px] uppercase italic truncate mb-1">{product.name}</h3>
        <div className="text-2xl font-black tracking-tighter mb-4" style={{ color: style.color }}>{price}฿</div>
        <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5 mb-4">
          {["1", "5", "10", "20"].map(w => (
            <button key={w} onClick={() => setWeight(w)} className={`flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all ${weight === w ? "bg-white text-black shadow-lg" : "text-white/20"}`}>{w}g</button>
          ))}
        </div>
      </div>
      <button onClick={() => { addItem({ ...product, price, weight, quantity: 1 }); setIsAdded(true); setTimeout(() => setIsAdded(false), 1000); }}
        className="w-full py-4 rounded-xl font-black uppercase text-[10px] shadow-lg active:scale-95 transition-all"
        style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}>
        {isAdded ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCategory, setActiveCategory] = React.useState("");
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
  const [orderStatus, setOrderStatus] = React.useState<"idle" | "loading" | "success">("idle");
  const [tgUser, setTgUser] = React.useState("");

  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  React.useEffect(() => {
    getProducts().then(data => { 
      setProducts(data); 
      setLoading(false); 
    });
  }, []);

  const categories = ["Buds", "Concentrates", "Accessories"];

  const handleSendOrder = async () => {
    if (!TG_TOKEN || !TG_CHAT_ID) return;
    setOrderStatus("loading");
    const message = `🚀 *НОВЫЙ ЗАКАЗ*\n\n👤 Клиент: ${tgUser || "Аноним"}\n\n🛒 *Товары:*\n${items.map(i => `• ${i.name} (${i.weight}g) x${i.quantity}`).join('\n')}\n\n💰 *ИТОГО: ${totalPrice}฿*`;
    try {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: "Markdown" })
      });
      setOrderStatus("success");
      setTimeout(() => { clearCart(); setIsCartOpen(false); setOrderStatus("idle"); }, 2000);
    } catch (e) { setOrderStatus("idle"); }
  };

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm flex flex-col items-center">
          <img src="/images/logo-optimized.webp" alt="BND" className="w-44 h-44 object-contain mb-10 drop-shadow-[0_0_50px_rgba(52,211,153,0.1)]" />
          
          <div className="grid grid-cols-1 gap-4 w-full">
            {categories.map((cat, idx) => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setView("shop"); }}
                className="group flex justify-between items-center bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white hover:text-black transition-all active:scale-95"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-black/10">
                    {cat === "Buds" && <Leaf size={20} />}
                    {cat === "Concentrates" && <Droplets size={20} />}
                    {cat === "Accessories" && <Zap size={20} />}
                  </div>
                  <span className="text-xl font-black uppercase italic tracking-widest">{cat}</span>
                </div>
                <ArrowRight size={24} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
          
          <p className="mt-12 text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] italic">App Service Terminal</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24">
      <header className="sticky top-0 z-[100] bg-[#050505]/90 backdrop-blur-xl p-5 border-b border-white/5 flex justify-between items-center">
        <button onClick={() => setView("landing")} className="flex items-center gap-3 py-2 px-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase italic">
           <img src="/images/logo-optimized.webp" className="w-6 h-6 object-contain" />
           Back
        </button>
        <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
          <ShoppingCart size={20} />
          {items.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 text-black text-[10px] font-black rounded-full flex items-center justify-center">{items.length}</span>}
        </button>
      </header>

      <div className="container mx-auto px-5 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.filter(p => p.category === activeCategory).map(p => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)}
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex justify-end" onClick={() => setIsCartOpen(false)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-10 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-12"><h2 className="text-4xl font-black uppercase italic">Cart</h2><button onClick={() => setIsCartOpen(false)}><X size={24}/></button></div>
              {orderStatus === "success" ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 size={80} className="text-emerald-400 mb-6" />
                  <h3 className="text-2xl font-black uppercase italic">Order Sent!</h3>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                    {items.map(item => (
                      <div key={item.id + item.weight} className="flex gap-5 p-5 bg-white/5 rounded-[2rem] items-center border border-white/5">
                        <img src={getImageUrl(item.image)} className="w-16 h-16 object-contain rounded-xl" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
                        <div className="flex-1">
                          <div className="text-[12px] font-black uppercase italic mb-1">{item.name}</div>
                          <div className="text-sm font-black text-white/40">{item.price * item.quantity}฿</div>
                        </div>
                        <div className="flex items-center bg-black/40 rounded-xl p-1.5 border border-white/5">
                          <button onClick={() => updateQuantity(item.id, item.weight, -1)} className="p-2 text-white/30"><Minus size={14}/></button>
                          <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.weight, 1)} className="p-2 text-white/30"><Plus size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-10 border-t border-white/10 space-y-8">
                    <input type="text" placeholder="@Your_Telegram_Nick" value={tgUser} onChange={(e) => setTgUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-sm font-bold text-white outline-none focus:border-emerald-400 transition-colors" />
                    <div className="flex justify-between items-baseline"><span className="text-sm font-black uppercase opacity-20 italic">Total Payment</span><span className="text-5xl font-black tracking-tighter">{totalPrice}฿</span></div>
                    <button onClick={handleSendOrder} className="w-full py-7 rounded-[2rem] bg-white text-black font-black uppercase text-[12px] tracking-widest shadow-2xl active:scale-95 transition-all">Send Order</button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
