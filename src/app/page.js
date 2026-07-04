'use client';
// src/app/page.js — Tokio Deco · Rediseño 2025

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Instagram, MessageCircle, Mail,
  Leaf, Scissors, Wind,
  Package, ChevronLeft, ChevronRight, Quote, Star, ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5493834540245';
const INSTAGRAM = 'tokio_decoar';
const EMAIL     = 'hola@tokiodeco.com.ar';

const categorias = [
  { id: 'macrame',  label: 'Macramé',  icon: Wind,     desc: 'Tejidos artesanales en hilo de algodón y yute' },
  { id: 'kraft',    label: 'Kraft',    icon: Scissors, desc: 'Diseños únicos sobre papel kraft y materiales naturales' },
  { id: 'textiles', label: 'Textiles', icon: Leaf,     desc: 'Tapices y tejidos en telar con fibras naturales' },
];

const testimonios = [
  { nombre: 'Romina G.',   ciudad: 'Buenos Aires', texto: 'Recibí mi colgante de macramé y quedé sin palabras. La calidad, el detalle, el empaque... todo es perfecto. Ya tengo el ojo puesto en el próximo.', estrellas: 5 },
  { nombre: 'Valeria M.',  ciudad: 'Córdoba',      texto: 'Pedí un tapiz personalizado para el living y superó todas mis expectativas. Silvia estuvo en contacto en todo momento. 100% recomendada.', estrellas: 5 },
  { nombre: 'Carolina F.', ciudad: 'Salta',        texto: 'Las piezas tienen una energía especial. Se nota el amor y el trabajo artesanal en cada nudo. Mi casa se transformó.', estrellas: 5 },
  { nombre: 'Luján P.',    ciudad: 'Mendoza',      texto: 'Regalo increíble para una amiga. Lo empaquetaron con mucho cuidado y llegó en tiempo perfecto. ¡Ya compré para mí también!', estrellas: 5 },
  { nombre: 'Daniela R.',  ciudad: 'Tucumán',      texto: 'Compré en una feria y no podía creer los precios para la calidad que ofrecen. Ahora sigo comprando online. Artesanía de verdad.', estrellas: 5 },
];

/* ──────────────────────────────────────────────────────────────
   useAutoSlide
────────────────────────────────────────────────────────────── */
function useAutoSlide(total, interval = 4000) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), interval);
  }, [total, interval]);
  useEffect(() => { reset(); return () => clearInterval(timerRef.current); }, [reset]);
  const go   = (i) => { setCurrent(i); reset(); };
  const prev = ()  => { setCurrent(c => (c - 1 + total) % total); reset(); };
  const next = ()  => { setCurrent(c => (c + 1) % total); reset(); };
  return { current, go, prev, next };
}

/* ──────────────────────────────────────────────────────────────
   useInView — dispara animación al entrar en viewport
────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ──────────────────────────────────────────────────────────────
   ProductCard
────────────────────────────────────────────────────────────── */
function ProductCard({ producto, compact = false }) {
  const { addToCart } = useCart();
  const imagen = producto.imagenes?.[0] ?? producto.imagen ?? null;
  const [ref, visible] = useInView(0.1);

  return (
    <div
      ref={ref}
      style={{
        background: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif",
        height: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
        borderRadius: 2,
      }}
    >
      <div style={{ position: 'relative', aspectRatio: compact ? '1/1' : '4/5', background: '#f5f0e8', overflow: 'hidden' }}>
        {imagen ? (
          <Image
            src={imagen}
            alt={producto.nombre}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={48} color="#c4b49a" />
          </div>
        )}
        {producto.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,14,10,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#f5f0e8', fontFamily: "'Cormorant Garamond', serif", fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sin stock</span>
          </div>
        )}
        {producto.stock > 0 && producto.stock <= 3 && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#c24b2e', color: '#fff', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', padding: '5px 12px', borderRadius: 1 }}>
            Últimas unidades
          </div>
        )}
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1, borderTop: '1px solid #ede8df' }}>
        {producto.categoria?.nombre && (
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#a07840', margin: 0 }}>
            {producto.categoria.nombre}
          </p>
        )}
        <Link href={`/productos/${producto.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: compact ? 17 : 20, color: '#120e0a', margin: 0, lineHeight: 1.25, fontWeight: 600 }}>
            {producto.nombre}
          </h3>
        </Link>
        {!compact && producto.descripcion && (
          <p style={{ fontSize: 13, color: '#7a6a5a', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {producto.descripcion}
          </p>
        )}
        <div style={{ marginTop: 'auto', paddingTop: 14 }}>
          {producto.stock > 0 ? (
            <button
              onClick={() => addToCart(producto, 1)}
              style={{ width: '100%', background: '#120e0a', color: '#f5f0e8', border: 'none', padding: compact ? '9px 0' : '11px 0', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'background 0.2s', borderRadius: 1 }}
              onMouseEnter={e => e.currentTarget.style.background = '#c24b2e'}
              onMouseLeave={e => e.currentTarget.style.background = '#120e0a'}
            >
              Agregar al carrito
            </button>
          ) : (
            <span style={{ display: 'block', textAlign: 'center', fontSize: 10, color: '#a07840', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '8px 0' }}>
              Sin stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO — estático, cinematográfico, split-screen
────────────────────────────────────────────────────────────── */
function Hero({ primeraImagen }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{ position: 'relative', minHeight: '100svh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#120e0a', overflow: 'hidden' }} className="td-hero">
      {/* Lado izquierdo — texto */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',// DESPUÉS — suma ~68px del navbar al padding top
padding: 'clamp(116px,12vw,164px) clamp(32px,5vw,80px) clamp(48px,8vw,96px)', position: 'relative', zIndex: 2 }}>
        <p style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)', transition: 'opacity 0.7s 0.1s, transform 0.7s 0.1s', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#c24b2e', marginBottom: 28, fontFamily: "'Outfit', sans-serif" }}>
          ✦ Artesanías · Catamarca, Argentina
        </p>

        <h1 style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(24px)', transition: 'opacity 0.8s 0.2s, transform 0.8s 0.2s', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(72px, 10vw, 120px)', color: '#f5f0e8', lineHeight: 0.88, fontWeight: 700, margin: 0 }}>
          Tokio<br />
          <span style={{ color: '#c24b2e', fontStyle: 'italic' }}>Deco</span>
        </h1>

        {/* Línea decorativa animada */}
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s 0.5s', display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
          <div style={{ height: 1, background: 'rgba(245,240,232,0.15)', flex: 1 }} />
          <span style={{ fontSize: 10, color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.3em', fontFamily: "'Outfit', sans-serif" }}>Hecho a mano</span>
          <div style={{ height: 1, background: 'rgba(245,240,232,0.15)', flex: 1 }} />
        </div>

        <p style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)', transition: 'opacity 0.8s 0.4s, transform 0.8s 0.4s', fontSize: 15, color: 'rgba(245,240,232,0.55)', lineHeight: 1.75, maxWidth: 360, marginBottom: 44, fontFamily: "'Outfit', sans-serif" }}>
          Piezas únicas nacidas del norte argentino. Cada nudo, cada trama lleva la huella viva de quien las creó.
        </p>

        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(12px)', transition: 'opacity 0.8s 0.55s, transform 0.8s 0.55s', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <Link href="/productos" className="td-btn-primary">
            Ver colección <ArrowRight size={14} style={{ marginLeft: 6 }} />
          </Link>
          <a href="#historia" className="td-btn-ghost">Nuestra historia</a>
        </div>

        {/* Métricas */}
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s 0.75s', display: 'flex', gap: 40, marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(245,240,232,0.08)' }}>
          {[{n:'+200', l:'Piezas'}, {n:'5+', l:'Años'}, {n:'100%', l:'Artesanal'}].map(({n,l}) => (
            <div key={l}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, color: '#c24b2e', margin: 0, lineHeight: 1, fontWeight: 600 }}>{n}</p>
              <p style={{ fontSize: 10, color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '4px 0 0', fontFamily: "'Outfit', sans-serif" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lado derecho — imagen */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Fondo decorativo si no hay imagen */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2a1f14 0%, #120e0a 60%, #1e1208 100%)' }} />

        {/* Patrón geométrico sutil */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1" fill="#f5f0e8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {primeraImagen && (
          <Image
            src={primeraImagen}
            alt="Pieza artesanal Tokio Deco"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: loaded ? 1 : 0, transition: 'opacity 1.2s 0.3s' }}
            priority
            sizes="50vw"
          />
        )}

        {/* Overlay gradiente */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(18,14,10,0.5) 0%, rgba(18,14,10,0.1) 60%, rgba(18,14,10,0.35) 100%)' }} />

        {/* Badge flotante */}
        <div style={{ position: 'absolute', bottom: 40, right: 32, background: 'rgba(18,14,10,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(245,240,232,0.1)', padding: '16px 24px', borderRadius: 2 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(245,240,232,0.5)', margin: '0 0 4px' }}>Nueva colección</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#f5f0e8', margin: 0, fontWeight: 600 }}>Primavera 2025</p>
        </div>

        {/* Línea vertical decorativa */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent 0%, rgba(194,75,46,0.4) 40%, transparent 100%)' }} />
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div className="td-scroll-line" />
        <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(245,240,232,0.25)', fontFamily: "'Outfit', sans-serif" }}>Scroll</span>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PonchoBanner — anuncio Fiesta Nacional e Internacional del Poncho
────────────────────────────────────────────────────────────── */
function PonchoBanner() {
  const [ref, visible] = useInView(0.2);
  return (
    <section style={{ padding: 'clamp(36px,5vw,56px) clamp(24px,4vw,48px)', background: '#faf7f2', borderBottom: '1px solid #ede8df' }}>
      <div
        ref={ref}
        className="td-poncho-inner"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(20px,4vw,48px)',
          flexWrap: 'wrap',
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.7s, transform 0.7s',
        }}
      >
        <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
          <Image
            src="/logoponcho.png"
            alt="Fiesta Nacional e Internacional del Poncho"
            fill
            style={{ objectFit: 'contain' }}
            sizes="84px"
          />
        </div>

        <div style={{ width: 1, height: 48, background: '#ede8df' }} className="td-poncho-divider" />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, maxWidth: 560 }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#c24b2e', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            ✦ Nos vemos ahí
          </p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(19px,2.6vw,28px)', color: '#120e0a', margin: 0, fontWeight: 600, lineHeight: 1.25 }}>
            Nos podés encontrar en la <em style={{ color: '#c24b2e', fontStyle: 'italic' }}>Fiesta Nacional e Internacional del Poncho 2026</em>
          </h3>
          <p style={{ fontSize: 12, color: '#a07840', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Outfit', sans-serif" }}>
            Catamarca, Argentina
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   MarqueeStrip
────────────────────────────────────────────────────────────── */
function MarqueeStrip() {
  const items = ['Macramé Artesanal', '◆', 'Tejidos en Telar', '◆', 'Papel Kraft', '◆', 'Hecho a Mano', '◆', 'Catamarca', '◆', 'Fibras Naturales', '◆', 'Piezas Únicas', '◆'];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: '#c24b2e', padding: '15px 0', overflow: 'hidden' }}>
      <div className="td-marquee" style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#f5f0e8', flexShrink: 0, fontFamily: "'Outfit', sans-serif" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   CategoryCards — bento grid
────────────────────────────────────────────────────────────── */
function CategoryCards() {
  const [ref, visible] = useInView();
  return (
    <section id="categorias" style={{ padding: 'clamp(64px,8vw,112px) clamp(24px,4vw,48px)', background: '#faf7f2' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 3 }} className="td-cat-grid">
          {/* Header cell */}
          <div style={{ gridColumn: '1 / 3', background: '#120e0a', padding: 'clamp(40px,5vw,64px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.7s 0.1s, transform 0.7s 0.1s' }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#c24b2e', marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Lo que hacemos</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,4.5vw,56px)', color: '#f5f0e8', margin: 0, lineHeight: 1.05, fontWeight: 600 }}>
              Tres líneas,<br />
              <em style={{ color: '#c24b2e' }}>una misma alma</em>
            </h2>
          </div>

          {/* Stat cell */}
          <div style={{ background: '#c24b2e', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.7s 0.2s, transform 0.7s 0.2s' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: '#f5f0e8', margin: 0, lineHeight: 1, fontWeight: 700 }}>+200</p>
            <p style={{ fontSize: 10, color: 'rgba(245,240,232,0.6)', textTransform: 'uppercase', letterSpacing: '0.25em', margin: '8px 0 0', fontFamily: "'Outfit', sans-serif" }}>Piezas creadas</p>
          </div>

          {/* Categorías */}
          {categorias.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/productos?busqueda=${cat.id}`}
                className="td-cat-card"
                style={{
                  background: '#fff',
                  padding: 'clamp(28px,3vw,48px)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(24px)',
                  transition: `opacity 0.7s ${0.3 + i * 0.1}s, transform 0.7s ${0.3 + i * 0.1}s, background 0.3s`,
                  borderBottom: '3px solid transparent',
                }}
              >
                <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8', borderRadius: '50%' }}>
                  <Icon size={22} color="#a07840" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: '#120e0a', margin: '0 0 8px', fontWeight: 600 }}>{cat.label}</h3>
                  <p style={{ fontSize: 13, color: '#7a6a5a', lineHeight: 1.6, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{cat.desc}</p>
                </div>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#c24b2e', fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                  Explorar <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FeaturedProducts — grid asimétrico
────────────────────────────────────────────────────────────── */
function FeaturedProducts({ productos }) {
  const featured = productos.slice(0, 5);
  const [ref, visible] = useInView(0.05);
  if (!featured.length) return null;

  return (
    <section style={{ padding: 'clamp(64px,8vw,112px) clamp(24px,4vw,48px)', background: '#120e0a' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#c24b2e', marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Selección</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,4.5vw,56px)', color: '#f5f0e8', margin: 0, fontWeight: 600, lineHeight: 1.05 }}>
              Piezas <em>destacadas</em>
            </h2>
          </div>
          <Link href="/productos" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(245,240,232,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Outfit', sans-serif", transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c24b2e'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.4)'}
          >
            Ver todo el catálogo <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid asimétrico */}
        <div ref={ref} className="td-featured-grid">
          {featured.map((p, i) => {
            const img = p.imagenes?.[0] ?? p.imagen ?? null;
            const isLarge = i === 0;
            return (
              <Link
                key={p.id}
                href={`/productos/${p.id}`}
                className={`td-feat-item td-feat-item-${i}`}
                style={{ textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)', transition: `opacity 0.7s ${i * 0.12}s, transform 0.7s ${i * 0.12}s` }}
              >
                <div style={{ position: 'relative', aspectRatio: isLarge ? '3/4' : '1/1', overflow: 'hidden', background: '#1e1208' }}>
                  {img ? (
                    <Image
                      src={img} alt={p.nombre} fill
                      style={{ objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                      sizes={isLarge ? '(max-width:768px) 100vw, 33vw' : '(max-width:768px) 50vw, 20vw'}
                      className="td-feat-img"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={40} color="#3a2a1a" />
                    </div>
                  )}
                  {/* Overlay hover */}
                  <div className="td-feat-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(18,14,10,0)', transition: 'background 0.4s', display: 'flex', alignItems: 'flex-end', padding: 20 }}>
                    <div className="td-feat-info" style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.3s, transform 0.3s' }}>
                      <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#c24b2e', margin: '0 0 4px', fontFamily: "'Outfit', sans-serif" }}>
                        {p.categoria?.nombre}
                      </p>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isLarge ? 22 : 16, color: '#f5f0e8', margin: 0, fontWeight: 600 }}>{p.nombre}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Historia — texto + imagen inmersiva
────────────────────────────────────────────────────────────── */
function Historia() {
  const [ref, visible] = useInView(0.1);
  return (
    <section id="historia" style={{ background: '#faf7f2', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="td-historia-grid">
        {/* Imagen */}
        <div style={{ position: 'relative', minHeight: 560, background: '#ede8df', overflow: 'hidden' }}>
          <img src="/silvia.heic" alt="Fundadora Tokio Deco" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,10,0.75) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40 }}>
            <div style={{ width: 40, height: 1, background: '#c24b2e', marginBottom: 16 }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: 'italic', color: 'rgba(245,240,232,0.65)', margin: 0, lineHeight: 1.6 }}>
              "Las manos crean lo que el corazón siente"
            </p>
          </div>
        </div>

        {/* Texto */}
        <div ref={ref} style={{ padding: 'clamp(56px,6vw,96px) clamp(40px,5vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(32px)', transition: 'opacity 0.8s, transform 0.8s' }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#c24b2e', marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>nuestra historia</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,50px)', color: '#120e0a', marginBottom: 32, lineHeight: 1.1, fontWeight: 600 }}>
            Raíces en el norte,<br />
            <em style={{ color: '#c24b2e' }}>arte en las manos</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 14, color: '#5a4e42', lineHeight: 1.85, fontFamily: "'Outfit', sans-serif" }}>
            <p style={{ margin: 0 }}>Crecí en Catamarca, una tierra donde la tradición artesanal forma parte del paisaje cotidiano. Hace 5 años descubrí una conexión especial con los materiales nobles y los procesos hechos a mano.</p>
            <p style={{ margin: 0 }}>Con el tiempo encontré en el macramé, el tejido artesanal y el trabajo en fibras mi propio lenguaje. Cada nudo, cada trama, cada pieza es una conversación entre mis manos y las técnicas.</p>
            <p style={{ margin: 0 }}><strong style={{ color: '#120e0a', fontWeight: 600 }}>Tokio Deco</strong> nació de ese amor profundo por lo hecho a mano. Un nombre que mezcla lo lejano con lo propio.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 48, paddingTop: 40, borderTop: '1px solid #ede8df' }}>
            {[{ num: '+200', label: 'Piezas creadas' }, { num: '5+', label: 'Años' }, { num: '100%', label: 'Artesanal' }].map(({ num, label }) => (
              <div key={label}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, color: '#c24b2e', margin: '0 0 4px', fontWeight: 700, lineHeight: 1 }}>{num}</p>
                <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#a09080', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Valores — numbered steps
────────────────────────────────────────────────────────────── */
function Valores() {
  const [ref, visible] = useInView(0.1);
  const pasos = [
    { n: '01', title: 'Materiales del norte', desc: 'Fibras naturales de la región — algodón, yute y lana — porque la tierra de Catamarca tiene mucho para dar.' },
    { n: '02', title: 'Sin moldes ni prisa', desc: 'Cada diseño nace libre, sin patrones fijos. La creatividad no entiende de apuros.' },
    { n: '03', title: 'Tejido a mano', desc: 'Nudo por nudo, hilo por hilo. El tiempo que lleva cada pieza es parte de su valor.' },
    { n: '04', title: 'Con identidad propia', desc: 'Cada objeto refleja la cultura del noroeste argentino. Arte que cuenta de dónde viene.' },
  ];
  return (
    <section style={{ padding: 'clamp(64px,8vw,112px) clamp(24px,4vw,48px)', background: '#120e0a' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 72 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: 'rgba(245,240,232,0.3)', margin: '0 0 12px' }}>"Lo que nos mueve"</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4.5vw,52px)', color: '#f5f0e8', margin: 0, fontWeight: 600 }}>Nuestra Forma de Hacer</h2>
        </div>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1, background: 'rgba(245,240,232,0.06)' }}>
          {pasos.map((step, i) => (
            <div key={step.n} style={{ background: '#120e0a', padding: 'clamp(32px,3vw,48px)', display: 'flex', flexDirection: 'column', gap: 20, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `opacity 0.7s ${i * 0.12}s, transform 0.7s ${i * 0.12}s` }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 72, color: 'rgba(194,75,46,0.2)', lineHeight: 1 }}>{step.n}</span>
              <div style={{ width: 32, height: 1, background: '#c24b2e' }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#f5f0e8', margin: 0, fontWeight: 600 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.45)', lineHeight: 1.75, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   AllProductsGrid
────────────────────────────────────────────────────────────── */
function AllProductsGrid({ productos, loading }) {
  return (
    <section id="productos" style={{ padding: 'clamp(64px,8vw,112px) clamp(24px,4vw,48px)', background: '#faf7f2' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#c24b2e', marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Catálogo</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px,5.5vw,64px)', color: '#120e0a', margin: 0, fontWeight: 600, lineHeight: 1 }}>
              Todos los<br />
              <em style={{ color: '#c24b2e' }}>Productos</em>
            </h2>
          </div>
          {!loading && (
            <p style={{ fontSize: 13, color: 'rgba(18,14,10,0.35)', fontFamily: "'Outfit', sans-serif" }}>
              {productos.length} {productos.length === 1 ? 'pieza' : 'piezas'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="td-products-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="td-skeleton" />)}
          </div>
        ) : productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'rgba(18,14,10,0.3)', fontStyle: 'italic' }}>
              Pronto habrá nuevas piezas disponibles
            </p>
          </div>
        ) : (
          <>
            <div className="td-products-grid">
              {productos.map(p => <ProductCard key={p.id} producto={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <Link href="/productos" className="td-btn-outline-dark">Ver catálogo completo <ArrowRight size={14} style={{ marginLeft: 6 }} /></Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   TestimonialsCarousel
────────────────────────────────────────────────────────────── */
function TestimonialsCarousel() {
  const { current, go, prev, next } = useAutoSlide(testimonios.length, 5500);
  const [ref, visible] = useInView(0.1);
  return (
    <section style={{ padding: 'clamp(64px,8vw,112px) clamp(24px,4vw,48px)', background: '#f5f0e8', overflow: 'hidden' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: 56, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'opacity 0.7s, transform 0.7s' }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#c24b2e', marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>Testimonios</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,4vw,50px)', color: '#120e0a', margin: 0, fontWeight: 600 }}>
            Voces de <em style={{ color: '#c24b2e' }}>Clientes</em>
          </h2>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', transform: `translateX(-${current * 100}%)`, transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
            {testimonios.map((t, i) => (
              <div key={i} style={{ minWidth: '100%', padding: '0 4px' }}>
                <div style={{ textAlign: 'center', padding: 'clamp(32px,4vw,56px)', background: '#fff', borderRadius: 2, borderBottom: '3px solid #c24b2e' }}>
                  <Quote size={28} color="#c24b2e" style={{ marginBottom: 28, opacity: 0.5 }} />
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px,2.5vw,26px)', color: '#120e0a', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 32 }}>
                    "{t.texto}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                    {[...Array(t.estrellas)].map((_, j) => <Star key={j} size={13} fill="#c24b2e" color="#c24b2e" />)}
                  </div>
                  <p style={{ fontSize: 12, color: '#120e0a', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{t.nombre}</p>
                  <p style={{ fontSize: 10, color: '#a09080', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Outfit', sans-serif" }}>{t.ciudad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 32 }}>
          {[{fn: prev, dir:'l'}, null, {fn: next, dir:'r'}].map((item, i) => {
            if (!item) return (
              <div key="dots" style={{ display: 'flex', gap: 8 }}>
                {testimonios.map((_, j) => (
                  <button key={j} onClick={() => go(j)} style={{ width: j === current ? 24 : 8, height: 8, background: j === current ? '#c24b2e' : 'rgba(18,14,10,0.15)', border: 'none', cursor: 'pointer', padding: 0, borderRadius: 4, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
                ))}
              </div>
            );
            return (
              <button key={i} onClick={item.fn}
                style={{ background: 'transparent', border: '1px solid rgba(18,14,10,0.2)', color: 'rgba(18,14,10,0.4)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 1 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c24b2e'; e.currentTarget.style.color = '#c24b2e'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(18,14,10,0.2)'; e.currentTarget.style.color = 'rgba(18,14,10,0.4)'; }}>
                {item.dir === 'l' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FraseBanner
────────────────────────────────────────────────────────────── */
function FraseBanner() {
  const [ref, visible] = useInView(0.2);
  return (
    <section style={{ padding: 'clamp(64px,8vw,96px) clamp(24px,4vw,48px)', background: '#c24b2e', position: 'relative', overflow: 'hidden' }}>
      {/* Patrón fondo */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p2" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M24 0 L48 24 L24 48 L0 24 Z" fill="none" stroke="#f5f0e8" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#p2)"/></svg>
      </div>
      <div ref={ref} style={{ maxWidth: 768, margin: '0 auto', textAlign: 'center', position: 'relative', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.8s, transform 0.8s' }}>
        <div style={{ fontSize: 80, color: 'rgba(245,240,232,0.15)', fontFamily: "'Cormorant Garamond', serif", lineHeight: 0.6, marginBottom: 24 }}>"</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,4vw,48px)', color: '#f5f0e8', fontStyle: 'italic', lineHeight: 1.35, margin: '0 0 28px' }}>
          Cada pieza que sale de mis manos lleva un pedacito de Catamarca.
        </p>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(245,240,232,0.55)', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
          — Fundadora de Tokio Deco
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Contacto
────────────────────────────────────────────────────────────── */
function Contacto() {
  const [ref, visible] = useInView(0.1);
  return (
    <section id="contacto" style={{ padding: 'clamp(64px,8vw,112px) clamp(24px,4vw,48px)', background: '#faf7f2' }}>
      <div ref={ref} style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.8s, transform 0.8s' }}>
        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#c24b2e', marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Contacto</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,5vw,56px)', color: '#120e0a', marginBottom: 16, fontWeight: 600, lineHeight: 1.1 }}>
          ¿Querés una pieza personalizada?
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: '#a07840', marginBottom: 40 }}>
          Escribime y juntas creamos algo único.
        </p>
        <p style={{ fontSize: 14, color: 'rgba(18,14,10,0.55)', lineHeight: 1.75, marginBottom: 48, maxWidth: 480, margin: '0 auto 48px', fontFamily: "'Outfit', sans-serif" }}>
          Hago piezas a pedido con las medidas, colores y materiales que elijas.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola! Me gustaría consultar sobre una pieza personalizada de Tokio Deco')}`} target="_blank" rel="noreferrer" className="td-btn-primary">
            <MessageCircle size={15} style={{ marginRight: 8 }} /> WhatsApp
          </a>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="td-btn-outline-dark">
            <Instagram size={15} style={{ marginRight: 8 }} /> Instagram
          </a>
          <a href={`mailto:${EMAIL}`} className="td-btn-outline-dark">
            <Mail size={15} style={{ marginRight: 8 }} /> Email
          </a>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   HomePage — root
────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/productos?page=1&pageSize=12')
      .then(r => r.json())
      .then(data => setProductos(data.productos ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const productosConStock = productos.filter(p => p.stock > 0);
  const primeraImagen = productosConStock[0]?.imagenes?.[0] ?? productosConStock[0]?.imagen ?? null;

  return (
    <main style={{ fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .td-marquee { animation: marquee 22s linear infinite; }

        @keyframes tdShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
          30%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          70%  { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }

        .td-scroll-line {
          width: 1px;
          height: 48px;
          background: rgba(245,240,232,0.3);
          animation: scrollLine 2s ease-in-out infinite;
        }

        .td-skeleton {
          background: linear-gradient(90deg, #ede8df 25%, #e2dbd0 50%, #ede8df 75%);
          background-size: 400px 100%;
          animation: tdShimmer 1.4s ease-in-out infinite;
          aspect-ratio: 4/5;
          min-height: 280px;
          border-radius: 2px;
        }

        .td-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .td-products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .td-products-grid { grid-template-columns: 1fr; } }

        /* Hero responsive */
        @media (max-width: 768px) {
          .td-hero { grid-template-columns: 1fr !important; }
          .td-hero > div:last-child { min-height: 320px; }
        }

        /* Poncho banner responsive */
        @media (max-width: 560px) {
          .td-poncho-divider { display: none; }
        }

        /* Categorías bento responsive */
        @media (max-width: 900px) {
          .td-cat-grid { grid-template-columns: 1fr 1fr !important; }
          .td-cat-grid > div:first-child { grid-column: 1 / 3 !important; }
        }
        @media (max-width: 560px) {
          .td-cat-grid { grid-template-columns: 1fr !important; }
          .td-cat-grid > div:first-child { grid-column: 1 / 2 !important; }
        }

        /* Category card hover */
        .td-cat-card:hover {
          background: #fdf9f4 !important;
          border-bottom-color: #c24b2e !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(18,14,10,0.08);
        }

        /* Featured grid */
        .td-featured-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 3px;
        }
        .td-feat-item-0 { grid-row: 1 / 3; }
        .td-feat-item-1 { grid-column: 2; grid-row: 1; }
        .td-feat-item-2 { grid-column: 3; grid-row: 1; }
        .td-feat-item-3 { grid-column: 2; grid-row: 2; }
        .td-feat-item-4 { grid-column: 3; grid-row: 2; }

        .td-feat-item-0 .td-feat-img { aspect-ratio: 3/4 !important; }

        @media (max-width: 768px) {
          .td-featured-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .td-feat-item-0 { grid-row: auto !important; grid-column: 1 / 3 !important; }
          .td-feat-item-1, .td-feat-item-2, .td-feat-item-3, .td-feat-item-4 { grid-column: auto !important; grid-row: auto !important; }
        }
        @media (max-width: 480px) {
          .td-featured-grid { grid-template-columns: 1fr !important; }
          .td-feat-item-0 { grid-column: 1 !important; }
        }

        /* Featured hover */
        .td-feat-item:hover .td-feat-overlay { background: rgba(18,14,10,0.55) !important; }
        .td-feat-item:hover .td-feat-info { opacity: 1 !important; transform: translateY(0) !important; }
        .td-feat-item:hover .td-feat-img { transform: scale(1.06) !important; }

        /* Historia responsive */
        @media (max-width: 768px) {
          .td-historia-grid { grid-template-columns: 1fr !important; }
        }

        /* Buttons */
        .td-btn-primary {
          display: inline-flex; align-items: center;
          background: #c24b2e; color: #f5f0e8;
          padding: 14px 32px; font-size: 11px;
          text-transform: uppercase; letter-spacing: 0.25em;
          text-decoration: none; border-radius: 1px;
          font-family: 'Outfit', sans-serif; font-weight: 500;
          transition: background 0.2s, transform 0.15s;
          border: none; cursor: pointer;
        }
        .td-btn-primary:hover { background: #a33a20; transform: translateY(-1px); }
        .td-btn-primary:active { transform: scale(0.98); }

        .td-btn-ghost {
          display: inline-flex; align-items: center;
          color: rgba(245,240,232,0.5); background: transparent;
          padding: 14px 24px; font-size: 11px;
          text-transform: uppercase; letter-spacing: 0.25em;
          text-decoration: none; font-family: 'Outfit', sans-serif;
          transition: color 0.2s;
        }
        .td-btn-ghost:hover { color: #f5f0e8; }

        .td-btn-outline-dark {
          display: inline-flex; align-items: center;
          border: 1px solid rgba(18,14,10,0.25); color: #120e0a;
          padding: 14px 32px; font-size: 11px;
          text-transform: uppercase; letter-spacing: 0.25em;
          text-decoration: none; border-radius: 1px;
          font-family: 'Outfit', sans-serif; font-weight: 500;
          transition: all 0.2s;
        }
        .td-btn-outline-dark:hover { background: #120e0a; color: #f5f0e8; }
      `}</style>

      {/* Hero */}
      {loading ? (
        <section style={{ minHeight: '100svh', background: '#120e0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: '#f5f0e8', margin: 0, fontWeight: 700 }}>
              Tokio <em style={{ color: '#c24b2e' }}>Deco</em>
            </p>
            <div style={{ marginTop: 24, width: 48, height: 2, background: '#c24b2e', margin: '24px auto 0' }} />
          </div>
        </section>
      ) : (
        <Hero primeraImagen={primeraImagen} />
      )}

      <PonchoBanner />

      <MarqueeStrip />
      <CategoryCards />
      {!loading && productosConStock.length > 0 && <FeaturedProducts productos={productosConStock} />}
      <AllProductsGrid productos={productos} loading={loading} />
      <Historia />
      <Valores />
      <TestimonialsCarousel />
      <FraseBanner />
      <Contacto />
    </main>
  );
}
