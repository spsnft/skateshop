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
  ArrowRight
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

// --- МИНИ-КАРТОЧКА (Для главной) ---
function MiniProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const style = GRADE_STYLES[String(product.subcategory || "").toLowerCase().trim()] || { color: "#34D399" };
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={() => onOpen(product)}
      className="flex flex-col items-center gap-1 cursor-pointer"
    >
      <div className="aspect-square w-full relative rounded-2xl overflow-hidden bg-white/5 border border-white/5">
        <img 
          src={getImageUrl(product.image)} 
          alt="" 
          className="w-full h-full object-contain"
          onError={(e) => e.currentTarget.src = "/product-placeholder.webp"}
        />
      </div>
      <span className="text-[10px] font-black tracking-tighter" style={{ color: style.color }}>{product.price}฿</span>
    </motion.div>
  );
}

// --- ПОЛНАЯ КАРТОЧКА (Для магазина) ---
function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [weight, setWeight] = React.useState("1");
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCart(s => s.addItem);
  const style = GRADE_STYLES[String(product.subcategory || "").toLowerCase().trim()] || { color: "#34D399", bg: "bg-white/5", border: "border-white/10" };
  const price = product.prices?.[weight] || product.price;

  return (
    <div className={`relative flex flex-col rounded-[1.8rem] border p-2.5 backdrop-blur-xl ${style.bg} ${style.border}`}>
      <button onClick={() => onOpen(product)} className="absolute top-4 right-4 z-20 p-2 bg-black/40 rounded-full text-white/40"><Info size={12} /></button>
      <div className="aspect-square relative overflow-hidden rounded-[1.4rem] bg-black/60 mb-3 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-contain" loading="lazy" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
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
      <button onClick={() => { addItem({ ...product, price, weight, quantity: 1 }); setIsAdded(true); setTimeout(() => setIsAdded(false), 1000); }}
        className="w-full mt-3 py-3 rounded-xl font-black uppercase text-[9px] shadow-lg active:scale-95 transition-all"
        style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}>
        {isAdded ? "Добавлено" : "В корзину"}
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
      if (data.length > 0) setActiveCategory(data[0].category);
    });
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  // Случайные 5 хитов для главной
  const hitProducts = React.useMemo(() => {
    return products
      .filter(p => String(p.badge || "").toLowerCase().trim() === "hit")
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }, [products]);

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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm flex flex-col items-center">
          <img src="/images/logo-optimized.webp" alt="BND" className="w-32 h-32 object-contain mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]" />
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-1">Phuket BND</h1>
          <p className="text-white/20 font-bold uppercase tracking-[0.4em] text-[8px] mb-12">Premium Selection</p>
          
          {/* СЕТКА ХИТОВ */}
          <div className="w-full mb-12">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[9px] font-black uppercase italic text-white/20 tracking-widest">Featured Hits</span>
              <div className="h-px flex-1 bg-white/5 mx-4" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {loading ? [1,2,3,4,5].map(i => <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />) :
                hitProducts.map(p => <MiniProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)
              }
            </div>
          </div>

          <button 
            onClick={() => setView("shop")}
            className="w-full group flex items-center justify-center gap-4 bg-white text-black py-6 rounded-[2.5rem] font-black uppercase italic tracking-widest active:scale-95 transition-all shadow-2xl"
          >
            Open Full Menu
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24">
      <header className="sticky top-0 z-[100] bg-[#050505]/90 backdrop-blur-xl p-4 border-b border-white/5 flex justify-between items-center">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 py-2 px-3 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase italic opacity-60">Home</button>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white/5 rounded-2xl border border-white/10">
          <ShoppingCart size={18} />
          {items.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{items.length}</span>}
        </button>
      </header>

      <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-[#050505]">
        {categories.map(cat => (
          <button key={cat as string} onClick={() => setActiveCategory(cat as string)} 
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all flex-shrink-0 ${activeCategory === cat ? "bg-white text-black" : "text-white/20"}`}>
            {cat as string}
          </button>
        ))}
      </div>

      <div className="container mx-auto px-4 mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {products.filter(p => p.category === activeCategory).map(p => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)}
      </div>

      {/* КОРЗИНА И ДЕТАЛИ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex justify-end" onClick={() => setIsCartOpen(false)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-8 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-black uppercase italic">Cart</h2><button onClick={() => setIsCartOpen(false)}><X size={20}/></button></div>
              {orderStatus === "success" ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 size={60} className="text-emerald-400 mb-4" />
                  <h3 className="text-xl font-black uppercase italic">Sent to Group!</h3>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                    {items.map(item => (
                      <div key={item.id + item.weight} className="flex gap-4 p-4 bg-white/5 rounded-[1.5rem] items-center">
                        <img src={getImageUrl(item.image)} className="w-12 h-12 object-contain" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
                        <div className="flex-1 text-[10px] font-black uppercase italic">{item.name}</div>
                        <div className="text-sm font-black">{item.price * item.quantity}฿</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 border-t border-white/10 space-y-6">
                    <input type="text" placeholder="@Nick" value={tgUser} onChange={(e) => setTgUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold text-white outline-none" />
                    <button onClick={handleSendOrder} className="w-full py-6 rounded-[1.5rem] bg-white text-black font-black uppercase text-[11px]">Checkout {totalPrice}฿</button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[160] bg-black/95 backdrop-blur-xl flex items-end sm:items-center justify-center" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#0a0a0a] w-full max-w-lg rounded-t-[2rem] border-t border-white/10 overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="aspect-square relative w-full border-b border-white/5">
                <img src={getImageUrl(selectedProduct.image)} alt="" className="w-full h-full object-contain" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-black/40 rounded-full text-white/70 backdrop-blur-md"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-5 text-left text-white">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedProduct.name}</h2>
                <div className="text-4xl font-black tracking-tighter text-emerald-400">{selectedProduct.price}฿</div>
                <button onClick={() => { useCart.getState().addItem({ ...selectedProduct, price: selectedProduct.price, weight: "1", quantity: 1 }); setSelectedProduct(null); }} className="w-full py-4 rounded-2xl font-black uppercase text-[10px] bg-white text-black">В корзину</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
