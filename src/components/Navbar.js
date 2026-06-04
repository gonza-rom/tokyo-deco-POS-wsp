'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Instagram, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { toggleCart, getItemCount } = useCart()
  const totalItems = getItemCount?.() ?? 0

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '/',          label: 'Inicio'    },
    { href: '/productos', label: 'Productos' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-crema shadow-sm border-b border-arena-200'
          : 'bg-crema border-b border-arena-300'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo-bg.png"
              alt="Tokio Deco"
              width={42}
              height={42}
              className="object-contain"
            />
            <span className="font-display text-xl lg:text-2xl text-carbon tracking-wide">
              Tokio <span className="text-terracota-500 italic">Deco</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans text-xs tracking-widest uppercase text-carbon/60 hover:text-terracota-500 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Iconos derecha */}
          <div className="flex items-center gap-3">
            
              href="https://instagram.com/tokio_decoar"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex text-carbon/50 hover:text-terracota-500 transition-colors"
            >
              <Instagram size={18} />
            </a>

            {/* Carrito */}
            <button
              onClick={toggleCart}
              className="relative text-carbon/60 hover:text-terracota-500 transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracota-500 text-crema text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-carbon/60 hover:text-carbon transition-colors"
              aria-label="Menú"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-crema border-t border-arena-200 px-4 pb-6 pt-2 animate-fade-in">
          <nav className="flex flex-col mt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-sans text-xs tracking-widest uppercase text-carbon/60 hover:text-terracota-500 transition-colors py-3 border-b border-arena-100"
              >
                {l.label}
              </Link>
            ))}

            <button
              onClick={() => { toggleCart(); setOpen(false) }}
              className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-carbon/60 hover:text-terracota-500 transition-colors py-3 border-b border-arena-100"
            >
              <ShoppingBag size={14} />
              Carrito
              {totalItems > 0 && (
                <span className="bg-terracota-500 text-crema text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {totalItems}
                </span>
              )}
            </button>

            
              href="https://instagram.com/tokio_decoar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-sans text-xs text-carbon/40 hover:text-terracota-500 mt-4"
            >
              <Instagram size={13} /> @tokio_decoar
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
