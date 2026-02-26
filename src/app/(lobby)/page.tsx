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
  Send, 
  ArrowRight,
  Zap
} from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { motion, AnimatePresence } from "framer-motion"

// --- CONFIG ---
const TG_TOKEN = "8496658347:AAE1OKbr1VlEdMOCPMtwoxJwaIWdbxfDZP8";
const TG_CHAT_ID = "-1002347525330"; 

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

// --- STORE ---
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

// --- COMPONENTS ---
const Badge = ({ type }: { type: string }) => {
  const styles: any = {
    sale: "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]",
    new: "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    hit: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
  };
  if (!type || !styles[type.toLowerCase()]) return null;
  return (
    <div className={`absolute -top-1 -left-1 z-30 px-3 py-1 rounded-br-xl rounded-tl-xl text-[8px] font-black uppercase tracking-tighter italic text-white ${styles[type.toLowerCase()]}`}>
      {type}
    </div>
  );
};

function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [weight, setWeight] = React.useState("1");
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCart(s => s.addItem);
  const style = GRADE_STYLES[String(product.subcategory || "").toLowerCase().trim()] || { color: "#34D399", bg: "bg-white/5", border: "border-white/10" };
  const price = product.prices?.[weight] || product.price;

  return (
    <div className={`relative flex flex-col rounded-[1.8rem] border p-2.5 backdrop-blur-xl transition-all ${style.bg} ${style.border}`}>
      <Badge type={product.badge} />
      <button onClick={() => onOpen(product)} className="absolute top-4 right-4 z-20 p-2 bg-black/40 rounded-full text-white/40"><Info size={12} /></button>
      <div className="aspect-square relative overflow-hidden rounded-[1.4rem] bg-black/60 mb-3 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="px-1 flex-1 text-left">
        <h3 className="font-bold text-white/90 text-[11px] uppercase italic truncate">{product.name}</h3>
        <div className="text-xl font-black tracking-tighter mb-2" style={{ color: style.color }}>{price}฿</div>
        <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map(w => (
            <button key={w} onClick={() => setWeight(w)} className={`flex-1 py-1 text-[8px] font-black rounded-md ${weight === w ? "bg-white text-black" : "text-white/20"}`}>{w}g</button>
          ))}
        </div>
      </div>
      <button 
        onClick={() => { addItem({ ...product, price, weight, quantity: 1 }); setIsAdded(true); setTimeout(() => setIsAdded(false), 1000); }}
        className="w-full mt-3 py-3 rounded-xl font-black uppercase text-[9px] shadow-lg active:scale-95 transition-all"
        style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}
      >
        {isAdded ? "Добавлено" : "В корзину"}
      </button>
    </div>
  );
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCategory, setActiveCategory] = React.useState("Buds");
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
  const [orderStatus, setOrderStatus] = React.useState<"idle" | "loading" | "success">("idle");
  const [tgUser, setTgUser] = React.useState("");

  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  React.useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const handleSendOrder = async () => {
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
    } catch (e) {
      alert("Ошибка отправки.");
      setOrderStatus("idle");
    }
  };

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col p-6">
        <header className="flex items-center gap-4 mb-16 mt-4">
          <div className="w-16 h-16 relative flex-shrink-0">
             <img src="/images/logo-optimized.webp" alt="BND" className="w-full h-full object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Phuket BND</h1>
            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Premium Selection</p>
          </div>
        </header>

        <div className="flex-1 space-y-10">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-[10px] font-black uppercase italic opacity-30 tracking-widest">Our Best Hits</h2>
              <button onClick={() => setView("shop")} className="text-[9px] font-black uppercase text-emerald-400 flex items-center gap-1">Full Menu <ArrowRight size={10}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {products.filter(p => p.badge === "HIT").slice(0, 2).map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />
              ))}
            </div>
          </section>

          <nav className="space-y-3">
            {["Buds", "Hash", "Concentrates"].map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setView("shop"); }} 
                className="w-full flex justify-between items-center p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all">
                <span className="font-black uppercase italic tracking-widest">{cat}</span>
                <ArrowRight size={20} className="opacity-20" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24">
      <header className="sticky top-0 z-[100] bg-[#050505]/90 backdrop-blur-xl p-4 border-b border-white/5 flex justify-between items-center">
        <button onClick={() => setView("landing")} className="flex items-center gap-2">
           <img src="/images/logo-optimized.webp" className="w-6 h-6 object-contain" />
           <span className="text-[10px] font-black uppercase italic">Shop</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white/5 rounded-2xl border border-white/10">
          <ShoppingCart size={18} />
          {items.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{items.length}</span>}
        </button>
      </header>

      <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {Array.from(new Set(products.map(p => p.category))).map(cat => (
          <button key={cat as string} onClick={() => setActiveCategory(cat as string)} 
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all flex-shrink-0 ${activeCategory === cat ? "bg-white text-black" : "text-white/20"}`}>
            {cat as string}
          </button>
        ))}
      </div>

      <div className="container mx-auto px-4 mt-6 grid grid-cols-2 gap-3">
        {products.filter(p => p.category === activeCategory).map(p => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)}
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex justify-end">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black uppercase italic">Cart</h2><button onClick={() => setIsCartOpen(false)}><X size={20}/></button></div>
              {orderStatus === "success" ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(52,211,153,0.3)]"><CheckCircle2 size={40} className="text-black" /></div>
                  <h3 className="text-2xl font-black uppercase italic mb-2">Success</h3>
                  <p className="text-white/40 text-xs">Заказ отправлен в тех. группу!</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                    {items.map(item => (
                      <div key={item.id + item.weight} className="flex gap-4 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 items-center">
                        <div className="w-12 h-12 bg-black rounded-xl overflow-hidden"><img src={getImageUrl(item.image)} className="w-full h-full object-contain" /></div>
                        <div className="flex-1">
                          <div className="text-[10px] font-black uppercase italic truncate">{item.name} ({item.weight}g)</div>
                          <div className="text-sm font-black opacity-40">{item.price * item.quantity}฿</div>
                        </div>
                        <div className="flex items-center bg-black/40 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, item.weight, -1)} className="p-1"><Minus size={12}/></button>
                          <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.weight, 1)} className="p-1"><Plus size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 border-t border-white/10 space-y-6">
                    <input type="text" placeholder="@Your_TG_Nick" value={tgUser} onChange={(e) => setTgUser(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold" />
                    <div className="flex justify-between items-baseline"><span className="text-xs font-black uppercase opacity-20">Total</span><span className="text-4xl font-black">{totalPrice}฿</span></div>
                    <button onClick={handleSendOrder} disabled={totalPrice === 0 || orderStatus === "loading"} className="w-full py-6 rounded-[1.5rem] bg-white text-black font-black uppercase text-[11px] tracking-widest">
                      {orderStatus === "loading" ? "Sending..." : "Checkout"}
                    </button>
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
