"use client"
import * as React from "react"
import Image from "next/image"
import { getProducts } from "@/lib/fetchers/product"
import { ShoppingCart, Trash2, X, Plus, Minus } from "lucide-react"
import { create } from "zustand"

// --- КОРЗИНА ---
interface CartItem {
  id: string; name: string; price: number; weight: string; quantity: number; image: string;
}
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, delta: number) => void;
}
const useCart = create<CartStore>((set) => ({
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
}));

// --- ЦВЕТА (ПРЕМИУМ-ГРАДАЦИЯ) ---
const GRADE_STYLES: Record<string, any> = {
  "silver grade": { color: "#C1C1C1", border: "border-white/20", bg: "bg-white/5", glow: "" },
  "golden grade": { color: "#FEC107", border: "border-[#FEC107]/40", bg: "bg-[#FEC107]/10", glow: "shadow-[#FEC107]/10" },
  "premium grade": { color: "#34D399", border: "border-[#34D399]/40", bg: "bg-[#193D2E]/30", glow: "shadow-[#34D399]/20" },
  "selected premium": { color: "#00CED1", border: "border-[#00CED1]/60", bg: "bg-[#004D40]/50", glow: "shadow-[#00CED1]/40" }, // Морская волна (Ярче!)
  "hash old school": { color: "#D2B48C", border: "border-[#402917]/60", bg: "bg-[#402917]/50", glow: "" },
  "hash fresh frozen": { color: "#3F999C", border: "border-[#3F999C]/50", bg: "bg-[#3F999C]/20", glow: "" },
  "hash fresh frozen premium": { color: "#5CE1E6", border: "border-[#5CE1E6]/50", bg: "bg-[#5CE1E6]/20", glow: "shadow-[#5CE1E6]/30" },
  "live rosin premium": { color: "#A855F7", border: "border-[#693A7B]/60", bg: "bg-[#693A7B]/40", glow: "shadow-[#693A7B]/30" },
};

const getStyle = (val: string) => {
  const lowVal = String(val || "").toLowerCase().trim();
  return GRADE_STYLES[lowVal] || { color: "#34D399", border: "border-white/10", bg: "bg-white/5" };
}

// --- КАРТОЧКА ---
function ProductCard({ product }: { product: any }) {
  const [weight, setWeight] = React.useState("1");
  const addItem = useCart(s => s.addItem);
  const style = getStyle(product.subcategory || product.category);
  const price = product.prices?.[weight] || product.price;

  return (
    <div className={`group relative flex flex-col rounded-[2.5rem] border p-4 transition-all duration-700 backdrop-blur-3xl ${style.bg} ${style.border} ${style.glow}`}>
      <div className="aspect-square relative overflow-hidden rounded-[2rem] bg-black/60 mb-5 border border-white/5 shadow-inner">
        <Image src={product.image ? `/images/${product.image.split('/').pop()}` : '/product-placeholder.webp'} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
      <h3 className="font-black text-white/90 text-sm uppercase italic mb-2 line-clamp-1">{product.name}</h3>
      <div className="text-3xl font-black mb-4 tracking-tighter" style={{ color: style.color }}>{price}฿</div>
      
      <div className="flex gap-1.5 mb-4 bg-black/40 p-1 rounded-2xl border border-white/5">
        {["1", "5", "10", "20"].map(w => (
          <button key={w} onClick={() => setWeight(w)} className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${weight === w ? "bg-white text-black shadow-xl" : "text-white/20 hover:text-white/40"}`}>{w}g</button>
        ))}
      </div>
      
      <button onClick={() => addItem({ id: product.id, name: product.name, price, weight, quantity: 1, image: product.image })} className="w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-2xl" style={{ backgroundColor: style.color, color: '#000' }}>Добавить</button>
    </div>
  )
}

// --- ГЛАВНАЯ ---
export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState("Buds")
  const [activeSub, setActiveSub] = React.useState("All")
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const { items, updateQuantity, removeItem } = useCart()

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  React.useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); })
  }, [])

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const subcategories = ["All", ...Array.from(new Set(products.filter(p => p.category === activeCategory).map(p => p.subcategory).filter(Boolean)))]
  const filtered = products.filter(p => (p.category === activeCategory) && (activeSub === "All" || p.subcategory === activeSub))

  const handleCheckout = () => {
    const text = `🚀 *Новый заказ:*\n\n${items.map(i => `• ${i.name} (${i.weight}g) x${i.quantity} — ${i.price * i.quantity}฿`).join('\n')}\n\n💰 *Итого: ${totalPrice}฿*`;
    window.open(`https://t.me/YOUR_TG_NICKNAME?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24 font-sans">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Inventory</h1>
          <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <ShoppingCart size={22} />
            {items.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 text-black text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">{items.length}</span>}
          </button>
        </div>

        {/* Категории */}
        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
          {!loading && categories.map(cat => (
            <button key={cat as string} onClick={() => { setActiveCategory(cat as string); setActiveSub("All"); }} className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? "bg-white text-black border-white shadow-2xl" : "border-white/5 text-white/20"}`}>{cat as string}</button>
          ))}
        </div>

        {/* Подкатегории */}
        {!loading && subcategories.length > 1 && (
          <div className="flex flex-wrap gap-6 mb-12 py-6 border-y border-white/5 overflow-x-auto no-scrollbar">
            {subcategories.map(sub => {
              const s = getStyle(sub as string);
              const isActive = activeSub === sub;
              return (
                <button key={sub as string} onClick={() => setActiveSub(sub as string)} className="text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-1" style={{ color: isActive ? s.color : 'rgba(255,255,255,0.2)' }}>
                  {sub as string}
                  {isActive && <div className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />}
                </button>
              )
            })}
          </div>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {loading ? [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-white/5 animate-pulse" />) : filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </section>
      </div>

      {/* ШТОРКА КОРЗИНЫ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex justify-end animate-in fade-in duration-300">
          <div className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white/5 rounded-full"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
              {items.map(item => (
                <div key={item.id + item.weight} className="flex gap-5 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 relative">
                  <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-black flex-shrink-0">
                    <Image src={item.image ? `/images/${item.image.split('/').pop()}` : '/product-placeholder.webp'} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">{item.weight}g</div>
                    <div className="text-sm font-black uppercase italic truncate mb-3">{item.name}</div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-black/40 rounded-xl border border-white/5">
                        <button onClick={() => updateQuantity(item.id, item.weight, -1)} className="p-2 text-white/40"><Minus size={14}/></button>
                        <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.weight, 1)} className="p-2 text-white/40"><Plus size={14}/></button>
                      </div>
                      <div className="text-base font-black text-white">{item.price * item.quantity}฿</div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id, item.weight)} className="absolute top-4 right-4 text-white/10 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-white/10 mt-6">
              <div className="flex justify-between items-baseline mb-8">
                <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Total</span>
                <span className="text-5xl font-black tracking-tighter text-emerald-400">{totalPrice}฿</span>
              </div>
              <button disabled={items.length === 0} onClick={handleCheckout} className="w-full py-6 bg-white text-black rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 disabled:opacity-10">Order in Telegram</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
