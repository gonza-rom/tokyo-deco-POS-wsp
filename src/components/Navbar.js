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
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: '#f5f0e8',
        borderBottom: scrolled
          ? '1px solid rgba(18,14,10,0.12)'
          : '1px solid rgba(18,14,10,0.18)',
        boxShadow: scrolled
          ? '0 2px 24px rgba(18,14,10,0.07)'
          : 'none',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(16px,3vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src="/logo-bg.png"
              alt="Tokio Deco"
              width={38}
              height={38}
              style={{ objectFit: 'contain' }}
            />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#120e0a', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1 }}>
              Tokio <em style={{ color: '#c24b2e', fontStyle: 'italic' }}>Deco</em>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="td-nav-desktop">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'rgba(18,14,10,0.55)',
                  textDecoration: 'none',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  paddingBottom: 2,
                  borderBottom: '1px solid transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#c24b2e'; e.currentTarget.style.borderBottomColor = '#c24b2e'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(18,14,10,0.55)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Iconos derecha */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            {/* Instagram — solo desktop */}
            
              href="https://instagram.com/tokio_decoar"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'rgba(18,14,10,0.45)', transition: 'color 0.2s', display: 'flex' }}
              className="td-nav-desktop"
              onMouseEnter={e => e.currentTarget.style.color = '#c24b2e'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(18,14,10,0.45)'}
            >
              <Instagram size={18} />
            </a>

            {/* Separador vertical */}
            <div style={{ width: 1, height: 20, background: 'rgba(18,14,10,0.12)' }} className="td-nav-desktop" />

            {/* Carrito */}
            <button
              onClick={toggleCart}
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 8px',
                color: 'rgba(18,14,10,0.6)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              aria-label="Carrito"
              onMouseEnter={e => e.currentTarget.style.color = '#c24b2e'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(18,14,10,0.6)'}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2, right: 2,
                  background: '#c24b2e',
                  color: '#f5f0e8',
                  fontSize: 9,
                  fontWeight: 700,
                  width: 16, height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  fontFamily: "'Outfit', sans-serif",
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — solo mobile */}
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(18,14,10,0.6)',
                padding: 4,
                display: 'flex',
                transition: 'color 0.2s',
              }}
              className="td-nav-mobile"
              aria-label="Menú"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: '#f5f0e8',
          borderTop: '1px solid rgba(18,14,10,0.1)',
          padding: '8px 24px 24px',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'rgba(18,14,10,0.6)',
                  textDecoration: 'none',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(18,14,10,0.08)',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                }}
              >
                {l.label}
              </Link>
            ))}

            <button
              onClick={() => { toggleCart(); setOpen(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(18,14,10,0.08)',
                cursor: 'pointer',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'rgba(18,14,10,0.6)',
                padding: '14px 0',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              <ShoppingBag size={14} />
              Carrito
              {totalItems > 0 && (
                <span style={{
                  background: '#c24b2e',
                  color: '#f5f0e8',
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 20,
                  fontFamily: "'Outfit', sans-serif",
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            
              href="https://instagram.com/tokio_decoar"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                color: 'rgba(18,14,10,0.35)',
                textDecoration: 'none',
                marginTop: 20,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <Instagram size={13} /> @tokio_decoar
            </a>
          </nav>
        </div>
      )}

      {/* CSS para mostrar/ocultar desktop vs mobile */}
      <style>{`
        @media (min-width: 768px) { .td-nav-mobile { display: none !important; } }
        @media (max-width: 767px) { .td-nav-desktop { display: none !important; } }
      `}</style>
    </header>
  )
}
