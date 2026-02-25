"use client"
import * as React from "react"
import Image from "next/image"
import { getProducts } from "@/lib/fetchers/product"
import { ShoppingCart, Trash2, X, Plus, Minus, Info, Phone, Send, CheckCircle2 } from "lucide-react"
import { create } from "zustand"
import { persist } from "zustand/middleware" // Добавили для сохранения
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

// --- КОРЗИНА С СОХРАНЕНИЕМ ---
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
    { name: "cart-storage" } // Ключ в localStorage
  )
);

// ... (GradeStyles и getStyle остаются прежними)

function ProductCard({ product, onOpen, index }: { product: any, onOpen: (p: any) => void, index: number }) {
  const [weight, setWeight] = React.useState("1");
  const [isAdded, setIsAdded] = React.useState(false); // Состояние для анимации кнопки
  const addItem = useCart(s => s.addItem);
  const style = getStyle(product.subcategory || product.category);
  const price = product.prices?.[weight] || product.price;

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price, weight, quantity: 1, image: product.image });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500); // Возврат кнопки через 1.5 сек
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
      className={`group relative flex flex-col rounded-[1.5rem] border p-2.5 backdrop-blur-xl ${style.bg} ${style.border}`}
    >
      <button onClick={() => onOpen(product)} className="absolute top-4 right-4 z-20 p-1.5 bg-black/40 rounded-full text-white/50 hover:text-white transition-colors">
        <Info size={14} />
      </button>
      
      <div className="aspect-square relative overflow-hidden rounded-[1.2rem] bg-black/60 mb-3 cursor-pointer" onClick={() => onOpen(product)}>
        <Image 
          src={product.image ? `/images/${product.image.split('/').pop()}` : '/product-placeholder.webp'} 
          alt="" 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          sizes="(max-width: 768px) 45vw, 20vw"
          priority={index < 4} // Ускоряем загрузку первых 4-х картинок
        />
      </div>

      <div className="px-1 space-y-1.5 flex-1 text-left">
        <h3 className="font-bold text-white/90 text-[11px] sm:text-[13px] uppercase italic truncate leading-tight">{product.name}</h3>
        <div className="text-lg font-black tracking-tighter" style={{ color: style.color }}>{price}฿</div>
        
        <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map(w => (
            <button key={w} onClick={() => setWeight(w)} className={`flex-1 py-1 text-[8px] font-black rounded-md transition-all ${weight === w ? "bg-white text-black shadow-md" : "text-white/20"}`}>{w}g</button>
          ))}
        </div>
      </div>

      <button 
        onClick={handleAdd}
        disabled={isAdded}
        className="w-full mt-3 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest active:scale-95 transition-all shadow-lg overflow-hidden relative" 
        style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div key="check" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center justify-center gap-1">
              <CheckCircle2 size={12} /> Добавлено
            </motion.div>
          ) : (
            <motion.span key="text" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
              В корзину
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

// ... (Остальной код IndexPage остается почти таким же, но добавь микровсплеск для иконки корзины)
