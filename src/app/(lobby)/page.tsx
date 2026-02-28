"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"
import { 
  ShoppingCart, X, Trash2, Info, CheckCircle2, ArrowRight, Leaf, Zap, Phone
} from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  removeItem: (id: string, weight: number) => void;
  clearCart: () => void;
}
const useCart = create<CartStore>()(persist((set) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const ex = state.items.find(i => i.id === newItem.id && i.weight === newItem.weight);
    if (ex) return { items: state.items.map(i => i === ex ? { ...i, quantity: i.quantity + 1 } : i) };
    return { items: [...state.items, newItem] };
  }),
  removeItem: (id, weight) => set((state) => ({
    items: state.items.filter(i => !(i.id === id && i.weight === weight))
  })),
  clearCart: () => set({ items: [] })
}), { name: "bnd-cart-v4" }));

// --- COMPONENT: BADGE ---
const ProductBadge = ({ type }: { type: any }) => {
  if (!type) return null;
  const safeType = String(type).toUpperCase().trim();
  const styles: Record<string, string> = {
    "NEW": "bg-cyan-400 text-black",
    "HIT": "bg-amber-400 text-black",
    "SALE": "bg-red-500 text-white"
  };
  if (!styles[safeType]) return null;
  return (
    <div className={`absolute top-3 left-3 z-[40] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-2xl ${styles[safeType]}`}>
      {safeType}
    </div>
  );
};

// --- COMPONENT: CARD ---
function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [weight, setWeight] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCart(s => s.addItem);
  const subcat = String(product.subcategory || "").toLowerCase().trim();
  const style = GRADE_STYLES[subcat] || { color: "#34D399", bg: "bg-white/5", border: "border-white/10" };
  
  // Если аксессуары — цена фиксированная, если бадс — расчетная
  const isBuds = product.category === "Buds";
  const currentPrice = isBuds ? getInterpolatedPrice(weight, subcat) : (product.price || 0);

  return (
    <div className={`relative flex flex-col rounded-[2.5rem] border p-5 backdrop-blur-xl ${style.bg} ${style.border}`}>
      <ProductBadge type={product.badge} />
      
      <button onClick={() => onOpen(product)} className="absolute top-6 right-6 z-20 p-2 bg-black/40 rounded-full text-white/40"><Info size={16} /></button>
      <div className="aspect-square relative overflow-hidden rounded-[2rem] bg-black/60 mb-6 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
      </div>

      <div className="flex-1 space-y-6 text-left">
        <div>
          <h3 className="font-bold text-white text-[14px] uppercase italic truncate mb-1">{product.name}</h3>
          <div className="text-3xl font-black tracking-tighter" style={{ color: style.color }}>{currentPrice}฿</div>
        </div>

        {isBuds && (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase text-white/20 italic tracking-widest">Weight</span>
              <span className="text-2xl font-black text-white italic leading-none">{weight}g</span>
            </div>
            <input type="range" min="0.5" max="20" step="0.5" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 20].map(v => (
                <button key={v} onClick={() => setWeight(v)} className={`py-2.5 text-[10px] font-black rounded-xl border transition-all ${weight === v ? "bg-white text-black border-white" : "border-white/5 text-white/30 bg-black/20"}`}>{v}g</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={() => { addItem({ ...product, price: currentPrice, weight: isBuds ? weight : 1, quantity: 1 }); setIsAdded(true); setTimeout(() => setIsAdded(false), 1000); }}
        className="w-full mt-8 py-5 rounded-[1.5rem] font-black uppercase text-[11px] shadow-lg active:scale-95 transition-all"
        style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}>
        {isAdded ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [view, setView] = React.useState<"landing" | "shop">("landing");
  const [activeCategory, setActiveCategory] = React.useState("Buds");
  const [activeSubcat, setActiveSubcat] = React.useState("All");
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
  const [orderStatus, setOrderStatus] = React.useState<"idle" | "loading" | "success">("idle");
  const [tgUser, setTgUser] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const { items, removeItem, clearCart } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  React.useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const subcategories = Array.from(new Set(products.filter(p => p.category === activeCategory).map(p => p.subcategory).filter(Boolean)));
  const visibleProducts = products.filter(p => p.category === activeCategory && (activeSubcat === "All" || p.subcategory === activeSubcat));

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
          <img src="/images/logo-optimized.webp" alt="BND" className="w-52 h-52 object-contain mb-12 drop-shadow-[0_0_50px_rgba(52,211,153,0.1)]" />
          <div className="grid grid-cols-1 gap-5 w-full">
            {["Buds", "Accessories"].map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setActiveSubcat("All"); setView("shop"); window.scrollTo(0,0); }} className="group flex justify-between items-center bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white hover:text-black transition-all active:scale-95">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-black/10">
                    {cat === "Buds" ? <Leaf size={24} /> : <Zap size={24} />}
                  </div>
                  <span className="text-2xl font-black uppercase italic tracking-widest">{cat}</span>
                </div>
                <ArrowRight size={28} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24">
      <header className="sticky top-0 z-[100] bg-[#050505]/95 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center">
        <button onClick={() => setView("landing")} className="flex items-center gap-3 py-2.5 px-5 bg-white/5 rounded-2xl border border-white/10 text-[11px] font-black uppercase italic"><img src="/images/logo-optimized.webp" className="w-7 h-7 object-contain" />Back</button>
        <button onClick={() => setIsCartOpen(true)} className="relative p-5 bg-white/5 rounded-2xl border border-white/10 shadow-xl"><ShoppingCart size={22} />{items.length > 0 && <span className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-400 text-black text-[11px] font-black rounded-full flex items-center justify-center">{items.length}</span>}</button>
      </header>

      <div className="p-5 flex gap-3 overflow-x-auto no-scrollbar border-b border-white/5 bg-[#050505]">
        <button onClick={() => setActiveSubcat("All")} className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase flex-shrink-0 ${activeSubcat === "All" ? "bg-white text-black" : "text-white/20"}`}>All Items</button>
        {subcategories.map(sub => (
          <button key={sub} onClick={() => setActiveSubcat(sub)} className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase flex-shrink-0 ${activeSubcat === sub ? "bg-white text-black" : "text-white/20"}`}>{sub}</button>
        ))}
      </div>

      <div className="container mx-auto px-6 mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {visibleProducts.map(p => (
          <ProductCard key={`${p.id}-${p.subcategory}`} product={p} onOpen={setSelectedProduct} />
        ))}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex justify-end" onClick={() => setIsCartOpen(false)}>
          <div className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-12 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10"><h2 className="text-4xl font-black uppercase italic">My Cart</h2><button onClick={() => setIsCartOpen(false)}><X size={28}/></button></div>
            
            {orderStatus === "success" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center"><CheckCircle2 size={100} className="text-emerald-400 mb-8" /><h3 className="text-3xl font-black uppercase italic">Order Sent!</h3></div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
                  {items.map(item => (
                    <div key={`${item.id}-${item.weight}`} className="flex gap-6 p-6 bg-white/5 rounded-[2.5rem] items-center border border-white/5 group">
                      <img src={getImageUrl(item.image)} className="w-20 h-20 object-contain rounded-2xl" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
                      <div className="flex-1">
                        <div className="text-[13px] font-black uppercase italic mb-1">{item.name}</div>
                        <div className="text-[11px] font-bold text-white/20 tracking-widest">{item.weight}g • {item.price}฿</div>
                      </div>
                      <button onClick={() => removeItem(item.id, item.weight)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-white/10 space-y-5">
                  <input type="text" placeholder="@Telegram_Nick" value={tgUser} onChange={(e) => setTgUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm font-bold text-white outline-none focus:border-emerald-400 transition-all" />
                  <input type="text" placeholder="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm font-bold text-white outline-none focus:border-emerald-400 transition-all" />
                  <div className="flex justify-between items-baseline pt-6 px-2"><span className="text-[12px] font-black uppercase opacity-20 italic">Total Payment</span><span className="text-6xl font-black tracking-tighter">{totalPrice}฿</span></div>
                  <button onClick={handleSendOrder} disabled={totalPrice === 0 || (!tgUser && !phone) || orderStatus === "loading"} className="w-full py-8 rounded-[2.5rem] bg-white text-black font-black uppercase text-[13px] tracking-widest shadow-2xl active:scale-95 disabled:opacity-20 transition-all">Send Now</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
