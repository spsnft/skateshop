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
  Phone, 
  Send 
} from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

// --- КОРЗИНА ---
interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, delta: number) => void;
  clearCart: () => void;
}

const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const existing = state.items.find(i => i.id === newItem.id && i.weight === newItem.weight);
        if (existing) return { items: state.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i) };
        return { items: [...state.items, newItem] };
      }),
      removeItem: (id, weight) => set((state) => ({ items: state.items.filter(i => !(i.id === id && i.weight === weight)) })),
      updateQuantity: (id, weight, delta) => set((state) => ({
        items: state.items.map(i => (i.id === id && i.weight === weight) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
      })),
      clearCart: () => set({ items: [] })
    }),
    { name: "bnd-cart-v1" }
  )
);

const GRADE_STYLES: Record<string, any> = {
  "silver grade": { color: "#C1C1C1", border: "border-white/10", bg: "bg-white/5" },
  "golden grade": { color: "#FEC107", border: "border-[#FEC107]/20", bg: "bg-[#FEC107]/5" },
  "premium grade": { color: "#34D399", border: "border-[#34D399]/30", bg: "bg-[#193D2E]/20" },
  "selected premium": { color: "#00CED1", border: "border-[#00CED1]/40", bg: "bg-[#004D40]/30" },
  "hash old school": { color: "#D2B48C", border: "border-[#402917]/40", bg: "bg-[#402917]/30" },
  "hash fresh frozen": { color: "#3F999C", border: "border-[#3F999C]/40", bg: "bg-[#3F999C]/20" },
  "hash fresh frozen premium": { color: "#5CE1E6", border: "border-[#5CE1E6]/40", bg: "bg-[#5CE1E6]/20" },
  "live rosin premium": { color: "#A855F7", border: "border-[#693A7B]/40", bg: "bg-[#693A7B]/30" },
};

const getStyle = (val: string) => {
  const lowVal = String(val || "").toLowerCase().trim();
  return GRADE_STYLES[lowVal] || { color: "#34D399", border: "border-white/10", bg: "bg-white/5" };
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/product-placeholder.webp';
  if (imagePath.startsWith('http')) return imagePath;
  return `/images/${imagePath.split('/').pop()}`;
}

// ЗАГЛУШКА ПРИ ЗАГРУЗКЕ
const ProductSkeleton = () => (
  <div className="flex flex-col rounded-[1.5rem] border border-white/5 p-2.5 bg-white/5 animate-pulse">
    <div className="aspect-square w-full rounded-[1.2rem] bg-white/10 mb-3" />
    <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
    <div className="h-6 w-1/2 bg-white/10 rounded mb-3" />
    <div className="h-8 w-full bg-white/10 rounded-xl" />
  </div>
);

function ProductCard({ product, onOpen, index }: { product: any, onOpen: (p: any) => void, index: number }) {
  const [weight, setWeight] = React.useState("1");
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCart(s => s.addItem);
  const style = getStyle(product.subcategory || product.category);
  const price = product.prices?.[weight] || product.price;

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price, weight, quantity: 1, image: product.image });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className={`relative flex flex-col rounded-[1.5rem] border p-2.5 backdrop-blur-xl ${style.bg} ${style.border}`}
    >
      <button onClick={() => onOpen(product)} className="absolute top-4 right-4 z-20 p-1.5 bg-black/40 rounded-full text-white/50 hover:text-white transition-colors">
        <Info size={14} />
      </button>

      <div className="aspect-square relative overflow-hidden rounded-[1.2rem] bg-black/60 mb-3 cursor-pointer" onClick={() => onOpen(product)}>
        <img 
          src={getImageUrl(product.image)} 
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          loading={index < 4 ? "eager" : "lazy"}
        />
      </div>

      <div className="px-1 space-y-1.5 flex-1 text-left">
        <h3 className="font-bold text-white/90 text-[11px] sm:text-[13px] uppercase italic truncate">{product.name}</h3>
        <div className="text-lg font-black tracking-tighter" style={{ color: style.color }}>{price}฿</div>
        <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map(w => (
            <button key={w} onClick={() => setWeight(w)} className={`flex-1 py-1 text-[8px] font-black rounded-md transition-all ${weight === w ? "bg-white text-black shadow-md" : "text-white/20"}`}>{w}g</button>
          ))}
        </div>
      </div>
      <button onClick={handleAdd} disabled={isAdded} className="w-full mt-3 py-2.5 rounded-xl font-black uppercase text-[9px] active:scale-95 transition-all shadow-lg" style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}>
        {isAdded ? "Добавлено" : "В корзину"}
      </button>
    </motion.div>
  )
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState("Buds")
  const [activeSub, setActiveSub] = React.useState("All")
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null)
  const [tgUser, setTgUser] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [isOrdered, setIsOrdered] = React.useState(false)

  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 40], [1, 0])
  const headerY = useTransform(scrollY, [0, 40], [0, -10])
  const navBackground = useTransform(scrollY, [0, 40], ["rgba(5, 5, 5, 0)", "rgba(5, 5, 5, 0.95)"])

  React.useEffect(() => {
    setLoading(true);
    getProducts().then(data => { 
      setProducts(data); 
      setLoading(false); 
    })
  }, [])

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const subcategories = ["All", ...Array.from(new Set(products.filter(p => p.category === activeCategory).map(p => p.subcategory).filter(Boolean)))]
  const filtered = products.filter(p => (p.category === activeCategory) && (activeSub === "All" || p.subcategory === activeSub))

  const handleCheckout = () => {
    const text = `🚀 НОВЫЙ ЗАКАЗ:\n\n👤 TG: ${tgUser || "—"}\n📞 Тел: ${phone || "—"}\n\n🛒 Товары:\n${items.map(i => `• ${i.name} (${i.weight}g) x${i.quantity}`).join('\n')}\n\n💰 ИТОГО: ${totalPrice}฿`;
    setIsOrdered(true);
    setTimeout(() => {
      window.location.href = `https://t.me/phuketbnd?text=${encodeURIComponent(text)}`;
      setTimeout(() => { setIsOrdered(false); setIsCartOpen(false); clearCart(); }, 1000);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans">
      <div className="sticky top-0 z-[100]">
        <motion.div style={{ backgroundColor: navBackground }} className="backdrop-blur-xl pt-6 pb-2 px-4 shadow-2xl">
          <div className="container mx-auto">
            <motion.header style={{ opacity: headerOpacity, y: headerY }} className="flex justify-between items-center mb-6">
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">Inventory</div>
              <button onClick={() => setIsCartOpen(true)} className="relative p-3.5 bg-white/5 rounded-2xl border border-white/10 active:scale-95 transition-transform">
                <motion.div key={items.length} animate={{ scale: [1, 1.3, 1] }}><ShoppingCart size={18} /></motion.div>
                {items.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{items.length}</span>}
              </button>
            </motion.header>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {loading ? [1,2,3].map(i => <div key={i} className="h-8 w-24 bg-white/5 rounded-xl animate-pulse" />) :
                categories.map(cat => (
                <button key={cat as string} onClick={() => { setActiveCategory(cat as string); setActiveSub("All"); }} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex-shrink-0 ${activeCategory === cat ? "bg-white text-black border-white shadow-lg" : "border-white/5 text-white/20"}`}>{cat as string}</button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mt-4">
        {!loading && subcategories.length > 1 && (
          <div className="flex gap-5 mb-8 overflow-x-auto no-scrollbar py-2 border-y border-white/5">
            {subcategories.map(sub => (
              <button key={sub as string} onClick={() => setActiveSub(sub as string)} className={`text-[9px] font-black uppercase tracking-widest relative py-1 flex-shrink-0 transition-colors ${activeSub === sub ? "text-emerald-400" : "text-white/20"}`}>
                {sub as string}
                {activeSub === sub && <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-px bg-emerald-400" />}
              </button>
            ))}
          </div>
        )}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {loading ? [1,2,3,4,5,6].map(i => <ProductSkeleton key={i} />) 
                   : filtered.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} onOpen={setSelectedProduct} />)}
        </section>
      </div>
      
      {/* КОРЗИНА И ДЕТАЛИ (Оставляем без изменений) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex justify-end">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-6 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black uppercase italic">Корзина</h2><button onClick={() => setIsCartOpen(false)}><X size={18}/></button></div>
              {isOrdered ? <div className="flex-1 flex flex-col items-center justify-center"><CheckCircle2 size={80} className="text-emerald-400" /><h3 className="mt-4 text-xl font-black uppercase italic">Заказ принят!</h3></div> 
              : <><div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                  {items.length === 0 ? <div className="h-full flex flex-col items-center justify-center opacity-10 font-black uppercase tracking-widest text-[10px]">Корзина пуста</div> 
                  : items.map(item => (
                    <div key={item.id + item.weight} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-black shrink-0">
                        <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 text-left"><div className="text-[11px] font-bold uppercase italic truncate mb-2">{item.name} ({item.weight}g)</div><div className="flex items-center justify-between"><div className="flex items-center bg-black/40 rounded-lg"><button onClick={() => updateQuantity(item.id, item.weight, -1)} className="p-1.5"><Minus size={10}/></button><span className="text-[10px] font-black w-4 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.weight, 1)} className="p-1.5"><Plus size={10}/></button></div><div className="text-sm font-black">{item.price * item.quantity}฿</div></div></div>
                      <button onClick={() => removeItem(item.id, item.weight)} className="text-white/10 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Send className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                      <input type="text" placeholder="@nick" value={tgUser} onChange={(e) => setTgUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs font-bold outline-none focus:border-white/30 transition-all" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                      <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-xs font-bold outline-none focus:border-white/30 transition-all" />
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline py-4"><span className="text-[9px] font-black uppercase text-white/20">Total</span><span className="text-4xl font-black">{totalPrice}฿</span></div>
                  <button onClick={handleCheckout} disabled={totalPrice === 0 || (!tgUser && !phone)} className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] bg-white text-black active:scale-95 transition-all disabled:opacity-10">Заказать в TG</button>
                </div></>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-xl flex items-end sm:items-center justify-center" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="bg-[#0a0a0a] w-full max-w-lg rounded-t-[2rem] border-t border-white/10 overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="aspect-square relative w-full border-b border-white/5">
                <img src={getImageUrl(selectedProduct.image)} alt={selectedProduct.name} className="w-full h-full object-contain" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-black/40 rounded-full text-white/70 backdrop-blur-md"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-5 text-left">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedProduct.name}</h2>
                <p className="text-white/40 text-xs leading-relaxed italic">{selectedProduct.description || "Premium Phuket selection."}</p>
                <div className="pt-4 flex justify-between items-center gap-4">
                   <div className="text-4xl font-black tracking-tighter" style={{ color: getStyle(selectedProduct.subcategory).color }}>{selectedProduct.price}฿</div>
                   <button onClick={() => { useCart.getState().addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, weight: "1", quantity: 1, image: selectedProduct.image }); setSelectedProduct(null); }} className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] active:scale-95 transition-transform" style={{ backgroundColor: getStyle(selectedProduct.subcategory).color, color: '#000' }}>В корзину</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}