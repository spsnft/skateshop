"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  Leaf,
  Zap,
  Phone,
  Send
} from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { motion, AnimatePresence } from "framer-motion"

// --- SETTINGS ---
const TG_TOKEN = process.env.NEXT_PUBLIC_TG_TOKEN;
const TG_CHAT_ID = process.env.NEXT_PUBLIC_TG_CHAT_ID;

const PRICE_GRIDS: Record<string, Record<number, number>> = {
  "silver grade": { 1: 150, 5: 700, 10: 1200, 20: 2000 },
  "golden grade": { 1: 250, 5: 1100, 10: 1700, 20: 3000 },
  "premium grade": { 1: 300, 5: 1300, 10: 2000, 20: 3500 },
  "selected premium": { 1: 350, 5: 1500, 10: 2500, 20: 4000 }
};

const GRADE_STYLES: Record<string, any> = {
  "silver grade": { color: "#C1C1C1", bg: "bg-white/5", border: "border-white/10" },
  "golden grade": { color: "#FEC107", bg: "bg-[#FEC107]/5", border: "border-[#FEC107]/20" },
  "premium grade": { color: "#34D399", bg: "bg-[#193D2E]/20", border: "border-[#34D399]/30" },
  "selected premium": { color: "#A855F7", bg: "bg-[#4B2E63]/20", border: "border-[#A855F7]/30" },
};

const getInterpolatedPrice = (weight: number, subcategory: string) => {
  const cat = subcategory.toLowerCase().trim();
  const grid = PRICE_GRIDS[cat] || PRICE_GRIDS["premium grade"];
  let price = 0;
  if (weight <= 1) price = grid[1] * weight;
  else if (weight <= 5) price = grid[1] + (grid[5] - grid[1]) * ((weight - 1) / 4);
  else if (weight <= 10) price = grid[5] + (grid[10] - grid[5]) * ((weight - 5) / 5);
  else if (weight <= 20) price = grid[10] + (grid[20] - grid[10]) * ((weight - 10) / 10);
  else price = (grid[20] / 20) * weight;
  return Math.round(price);
};

const getImageUrl = (path: string) => {
  if (!path) return '/product-placeholder.webp';
  return path.startsWith('http') ? path : `/images/${path.split('/').pop()}`;
}

// --- STORE ---
interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  updateQuantity: (id: string, weight: number, delta: number) => void;
  clearCart: () => void;
}
const useCart = create<CartStore>()(persist((set) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const ex = state.items.find(i => i.id === newItem.id && i.weight === newItem.weight);
    if (ex) return { items: state.items.map(i => i === ex ? { ...i, quantity: i.quantity + 1 } : i) };
    return { items: [...state.items, newItem] };
  }),
  updateQuantity: (id, weight, delta) => set((state) => ({
    items: state.items.map(i => (i.id === id && i.weight === weight) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
  })),
  clearCart: () => set({ items: [] })
}), { name: "bnd-cart-v3" }));

// --- COMPONENTS ---
function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [weight, setWeight] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCart(s => s.addItem);
  const subcat = String(product.subcategory || "").toLowerCase().trim();
  const style = GRADE_STYLES[subcat] || { color: "#34D399", bg: "bg-white/5", border: "border-white/10" };
  const currentPrice = getInterpolatedPrice(weight, subcat);

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`relative flex flex-col rounded-[2.2rem] border p-4 backdrop-blur-xl ${style.bg} ${style.border}`}>
      <button onClick={() => onOpen(product)} className="absolute top-5 right-5 z-20 p-2 bg-black/40 rounded-full text-white/40"><Info size={14} /></button>
      <div className="aspect-square relative overflow-hidden rounded-[1.8rem] bg-black/60 mb-5 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
      </div>
      <div className="flex-1 space-y-5 text-left">
        <div>
          <h3 className="font-bold text-white text-[13px] uppercase italic truncate mb-1">{product.name}</h3>
          <div className="text-3xl font-black tracking-tighter" style={{ color: style.color }}>{currentPrice}฿</div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-black uppercase text-white/20 italic tracking-widest">Weight</span>
            <span className="text-xl font-black text-white italic leading-none">{weight}g</span>
          </div>
          <input type="range" min="0.5" max="20" step="0.5" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 5, 10, 20].map(v => (
              <button key={v} onClick={() => setWeight(v)} className={`py-2 text-[9px] font-black rounded-xl border transition-all ${weight === v ? "bg-white text-black border-white" : "border-white/5 text-white/30 bg-black/20"}`}>{v}g</button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => { addItem({ ...product, price: currentPrice, weight, quantity: 1 }); setIsAdded(true); setTimeout(() => setIsAdded(false), 1000); }}
        className="w-full mt-6 py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg active:scale-95 transition-all"
        style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}>
        {isAdded ? "Added to Cart" : "Add to Cart"}
      </button>
    </motion.div>
  );
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCategory, setActiveCategory] = React.useState("Buds");
  const [activeSubcat, setActiveSubcat] = React.useState("All");
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
  const [orderStatus, setOrderStatus] = React.useState<"idle" | "loading" | "success">("idle");
  const [tgUser, setTgUser] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const { items, updateQuantity, clearCart } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  React.useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  // Получаем список подкатегорий для текущей категории
  const subcategories = React.useMemo(() => {
    const filtered = products.filter(p => p.category === activeCategory);
    const unique = Array.from(new Set(filtered.map(p => p.subcategory).filter(Boolean)));
    return ["All", ...unique];
  }, [products, activeCategory]);

  const handleSendOrder = async () => {
    if (!TG_TOKEN || !TG_CHAT_ID) return;
    setOrderStatus("loading");
    const message = `🚀 *НОВЫЙ ЗАКАЗ*\n\n👤 TG: ${tgUser || "—"}\n📞 Тел: ${phone || "—"}\n\n🛒 *Товары:*\n${items.map(i => `• ${i.name} (${i.weight}g) x${i.quantity}`).join('\n')}\n\n💰 *ИТОГО: ${totalPrice}฿*`;
    try {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: "Markdown" })
      });
      setOrderStatus("success");
      setTimeout(() => { clearCart(); setIsCartOpen(false); setOrderStatus("idle"); setTgUser(""); setPhone(""); }, 2000);
    } catch (e) { setOrderStatus("idle"); }
  };

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm flex flex-col items-center">
          <img src="/images/logo-optimized.webp" alt="BND" className="w-44 h-44 object-contain mb-10 drop-shadow-[0_0_50px_rgba(52,211,153,0.1)]" />
          <div className="grid grid-cols-1 gap-4 w-full">
            {["Buds", "Accessories"].map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setActiveSubcat("All"); setView("shop"); }} className="group flex justify-between items-center bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white hover:text-black transition-all active:scale-95">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-black/10">
                    {cat === "Buds" ? <Leaf size={20} /> : <Zap size={20} />}
                  </div>
                  <span className="text-xl font-black uppercase italic tracking-widest">{cat}</span>
                </div>
                <ArrowRight size={24} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24">
      <header className="sticky top-0 z-[100] bg-[#050505]/90 backdrop-blur-xl p-5 border-b border-white/5 flex justify-between items-center">
        <button onClick={() => setView("landing")} className="flex items-center gap-3 py-2 px-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase italic"><img src="/images/logo-optimized.webp" className="w-6 h-6 object-contain" />Back</button>
        <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-white/5 rounded-2xl border border-white/10 shadow-lg"><ShoppingCart size={20} />{items.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 text-black text-[10px] font-black rounded-full flex items-center justify-center">{items.length}</span>}</button>
      </header>
      
      {/* ЛЕНТА ПОДКАТЕГОРИЙ (ФИЛЬТР) */}
      <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-[#050505]">
        {subcategories.map(sub => (
          <button key={sub} onClick={() => setActiveSubcat(sub)} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all flex-shrink-0 ${activeSubcat === sub ? "bg-white text-black" : "text-white/20"}`}>{sub}</button>
        ))}
      </div>

      <div className="container mx-auto px-5 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products
          .filter(p => p.category === activeCategory)
          .filter(p => activeSubcat === "All" || p.subcategory === activeSubcat)
          .map(p => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)
        }
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex justify-end" onClick={() => setIsCartOpen(false)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-10 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8"><h2 className="text-4xl font-black uppercase italic">Cart</h2><button onClick={() => setIsCartOpen(false)}><X size={24}/></button></div>
              {orderStatus === "success" ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center"><CheckCircle2 size={80} className="text-emerald-400 mb-6" /><h3 className="text-2xl font-black uppercase italic">Sent!</h3></div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                    {items.map(item => (
                      <div key={item.id + item.weight} className="flex gap-5 p-5 bg-white/5 rounded-[2rem] items-center border border-white/5">
                        <img src={getImageUrl(item.image)} className="w-16 h-16 object-contain rounded-xl" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
                        <div className="flex-1"><div className="text-[12px] font-black uppercase italic mb-1">{item.name} ({item.weight}g)</div><div className="text-sm font-black text-white/40">{item.price * item.quantity}฿</div></div>
                        <div className="flex items-center bg-black/40 rounded-xl p-1.5 border border-white/5">
                          <button onClick={() => updateQuantity(item.id, item.weight, -1)} className="p-2 text-white/30"><Minus size={14}/></button>
                          <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.weight, 1)} className="p-2 text-white/30"><Plus size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 border-t border-white/10 space-y-4">
                    <input type="text" placeholder="@Telegram" value={tgUser} onChange={(e) => setTgUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-5 text-sm font-bold text-white outline-none focus:border-emerald-400" />
                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-5 text-sm font-bold text-white outline-none focus:border-emerald-400" />
                    <div className="flex justify-between items-baseline pt-4"><span className="text-sm font-black uppercase opacity-20 italic">Total</span><span className="text-5xl font-black tracking-tighter">{totalPrice}฿</span></div>
                    <button onClick={handleSendOrder} disabled={totalPrice === 0 || (!tgUser && !phone) || orderStatus === "loading"} className="w-full py-7 rounded-[2.2rem] bg-white text-black font-black uppercase text-[12px] tracking-widest active:scale-95 disabled:opacity-20 transition-all">Send Order</button>
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
