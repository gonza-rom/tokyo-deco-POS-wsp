'use client';
// src/app/page.js
// Home de Tokio Deco — datos desde DevHub POS via /api/productos

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MessageCircle, Mail, Leaf, Scissors, Wind, Star, Package, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const WA_NUMBER  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5493834540245';
const INSTAGRAM  = 'tokio_decoar';
const EMAIL      = 'hola@tokiodeco.com.ar';

const categorias = [
  { id: 'macrame',   label: 'Macramé',  icon: Wind,     desc: 'Tejidos artesanales en hilo de algodón y yute' },
  { id: 'kraft',     label: 'Kraft',    icon: Scissors, desc: 'Diseños únicos sobre papel kraft y materiales naturales' },
  { id: 'textiles',  label: 'Textiles', icon: Leaf,     desc: 'Tapices y tejidos en telar con fibras naturales' },
];

const testimonios = [
  { nombre: 'Romina G.', ciudad: 'Buenos Aires', texto: 'Recibí mi colgante de macramé y quedé sin palabras. La calidad, el detalle, el empaque... todo es perfecto. Ya tengo el ojo puesto en el próximo.', estrellas: 5 },
  { nombre: 'Valeria M.', ciudad: 'Córdoba', texto: 'Pedí un tapiz personalizado para el living y superó todas mis expectativas. Silvia estuvo en contacto en todo momento. 100% recomendada.', estrellas: 5 },
  { nombre: 'Carolina F.', ciudad: 'Salta', texto: 'Las piezas tienen una energía especial. Se nota el amor y el trabajo artesanal en cada nudo. Mi casa se transformó.', estrellas: 5 },
  { nombre: 'Luján P.', ciudad: 'Mendoza', texto: 'Regalo increíble para una amiga. Lo empaquetaron con mucho cuidado y llegó en tiempo perfecto. ¡Ya compré para mí también!', estrellas: 5 },
  { nombre: 'Daniela R.', ciudad: 'Tucumán', texto: 'Compré en una feria y no podía creer los precios para la calidad que ofrecen. Ahora sigo comprando online. Artesanía de verdad.', estrellas: 5 },
];

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n ?? 0);

// ── Hook: useAutoSlide ────────────────────────────────────────────────────────
function useAutoSlide(total, interval = 4000) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), interval);
  }, [total, interval]);

  useEffect(() => { reset(); return () => clearInterval(timerRef.current); }, [reset]);

  const go = (i) => { setCurrent(i); reset(); };
  const prev = () => { setCurrent(c => (c - 1 + total) % total); reset(); };
  const next = () => { setCurrent(c => (c + 1) % total); reset(); };

  return { current, go, prev, next };
}

// ── ProductCard Tokio Deco ────────────────────────────────────────────────────
function ProductCard({ producto, compact = false }) {
  const { addToCart } = useCart();
  const imagen = producto.imagenes?.[0] ?? producto.imagen ?? null;

  return (
    <div style={{
      background: '#faf9f7',
      border: '1px solid #e8e0d4',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      height: '100%',
    }}>
      <div style={{ position: 'relative', aspectRatio: compact ? '1/1' : '4/3', background: '#f0ebe3', overflow: 'hidden' }}>
        {imagen ? (
          <Image
            src={imagen}
            alt={producto.nombre}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={48} color="#c4b49a" />
          </div>
        )}
        {producto.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,14,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#faf9f7', fontFamily: 'Georgia, serif', fontSize: 18 }}>Sin stock</span>
          </div>
        )}
        {producto.stock > 0 && producto.stock <= 3 && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: '#d4583a', color: '#faf9f7', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '4px 10px' }}>
            Últimas unidades
          </div>
        )}
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {producto.categoria?.nombre && (
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#b8945a', margin: 0 }}>
            {producto.categoria.nombre}
          </p>
        )}
        <Link href={`/productos/${producto.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: compact ? 16 : 18, color: '#1a140e', margin: 0, lineHeight: 1.3 }}>
            {producto.nombre}
          </h3>
        </Link>
        {!compact && producto.descripcion && (
          <p style={{ fontSize: 13, color: '#7a6a5a', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {producto.descripcion}
          </p>
        )}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #e8e0d4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: compact ? 18 : 22, color: '#d4583a', margin: 0, fontWeight: 600 }}>
            {fmt(producto.precio)}
          </p>
          {producto.stock > 0 ? (
            <button
              onClick={() => addToCart(producto, 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#5f8f4e', color: '#faf9f7',
                border: 'none', padding: compact ? '6px 14px' : '8px 16px',
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#4a7040'}
              onMouseLeave={e => e.currentTarget.style.background = '#5f8f4e'}
            >
              Agregar
            </button>
          ) : (
            <span style={{ fontSize: 11, color: '#b8945a', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Sin stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── HeroSlider ────────────────────────────────────────────────────────────────
function HeroSlider({ productos }) {
  const slides = productos.slice(0, 5);
  const { current, go, prev, next } = useAutoSlide(slides.length || 1, 5000);

  const heroSlides = slides.length > 0 ? slides : [null];

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#1a140e' }}>
      {/* Slides */}
      {heroSlides.map((producto, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.4,0,0.2,1)',
            zIndex: i === current ? 1 : 0,
          }}
        >
          {producto?.imagenes?.[0] || producto?.imagen ? (
            <Image
              src={producto.imagenes?.[0] ?? producto.imagen}
              alt={producto.nombre}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            <div style={{
              inset: 0, position: 'absolute',
              background: `radial-gradient(circle at ${30 + i * 15}% 50%, #d4583a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #5f8f4e 0%, transparent 40%), #1a140e`
            }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,20,14,0.85) 0%, rgba(26,20,14,0.4) 60%, rgba(26,20,14,0.1) 100%)' }} />
        </div>
      ))}

      {/* Overlay pattern */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(0deg, #faf9f7 0px, #faf9f7 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #faf9f7 0px, #faf9f7 1px, transparent 1px, transparent 40px)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 560 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#d4583a', marginBottom: 20 }}>
            ✦ Artesanías & Textiles · Catamarca
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(64px, 10vw, 96px)', color: '#faf9f7', lineHeight: 0.9, marginBottom: 28 }}>
            Tokio
            <br />
            <em style={{ color: '#d4583a', fontStyle: 'normal' }}>Deco</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(250,249,247,0.65)', lineHeight: 1.7, maxWidth: 380, marginBottom: 36 }}>
            Piezas únicas hechas a mano con amor y materiales naturales. Cada objeto lleva la huella de quien lo creó.
          </p>

          {/* Slide info */}
          {heroSlides[current] && (
            <div style={{ marginBottom: 32, padding: '16px 20px', borderLeft: '2px solid #d4583a', background: 'rgba(250,249,247,0.06)', backdropFilter: 'blur(4px)' }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#b8945a', margin: '0 0 4px' }}>
                {heroSlides[current].categoria?.nombre ?? 'Destacado'}
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#faf9f7', margin: '0 0 4px' }}>
                {heroSlides[current].nombre}
              </p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#d4583a', margin: 0 }}>
                {fmt(heroSlides[current].precio)}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link href="/productos" style={{ background: '#d4583a', color: '#faf9f7', padding: '14px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#b84a2e'}
              onMouseLeave={e => e.currentTarget.style.background = '#d4583a'}>
              Ver colección
            </Link>
            <a href="#historia" style={{ border: '1px solid rgba(250,249,247,0.3)', color: '#faf9f7', padding: '14px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(250,249,247,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              Nuestra historia
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {heroSlides.length > 1 && (
        <>
          <button onClick={prev} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 4, background: 'rgba(250,249,247,0.1)', border: '1px solid rgba(250,249,247,0.2)', color: '#faf9f7', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(250,249,247,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(250,249,247,0.1)'}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 4, background: 'rgba(250,249,247,0.1)', border: '1px solid rgba(250,249,247,0.2)', color: '#faf9f7', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(250,249,247,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(250,249,247,0.1)'}>
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: 8 }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                style={{
                  width: i === current ? 32 : 8, height: 8,
                  background: i === current ? '#d4583a' : 'rgba(250,249,247,0.35)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div style={{ position: 'absolute', bottom: 40, right: 24, zIndex: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#faf9f7' }}>{String(current + 1).padStart(2, '0')}</span>
            <span style={{ width: 32, height: 1, background: 'rgba(250,249,247,0.3)', display: 'block' }} />
            <span style={{ fontSize: 13, color: 'rgba(250,249,247,0.4)' }}>{String(heroSlides.length).padStart(2, '0')}</span>
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 36, left: 24, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.35em', color: 'rgba(250,249,247,0.4)', writingMode: 'vertical-rl' }}>Scroll</span>
        <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(250,249,247,0.4), transparent)' }} />
      </div>
    </section>
  );
}

// ── FeaturedSlider (productos destacados horizontal) ─────────────────────────
function FeaturedSlider({ productos }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef(null);
  const CARD_W = 320;
  const GAP = 24;
  const step = CARD_W + GAP;
  const maxOffset = Math.max(0, productos.length * step - (typeof window !== 'undefined' ? window.innerWidth - 80 : 900));

  const slide = (dir) => {
    setOffset(prev => Math.max(0, Math.min(maxOffset, prev + dir * step)));
  };

  const onMouseDown = (e) => { setDragging(true); setStartX(e.clientX); };
  const onMouseMove = (e) => { if (!dragging) return; setDragOffset(e.clientX - startX); };
  const onMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragOffset < -80) slide(1);
    else if (dragOffset > 80) slide(-1);
    setDragOffset(0);
  };

  return (
    <section style={{ padding: '96px 0', background: '#fdf8f3', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#d4583a', marginBottom: 12 }}>✦ Lo más buscado</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,48px)', color: '#1a140e', margin: 0 }}>
            Piezas Destacadas
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => slide(-1)} disabled={offset === 0}
            style={{ width: 48, height: 48, border: '1px solid #e8e0d4', background: 'transparent', cursor: offset === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: offset === 0 ? 0.3 : 1, transition: 'all 0.2s', color: '#1a140e' }}
            onMouseEnter={e => { if (offset !== 0) e.currentTarget.style.background = '#1a140e'; e.currentTarget.style.color = '#faf9f7'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a140e'; }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => slide(1)} disabled={offset >= maxOffset}
            style={{ width: 48, height: 48, border: '1px solid #e8e0d4', background: 'transparent', cursor: offset >= maxOffset ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: offset >= maxOffset ? 0.3 : 1, transition: 'all 0.2s', color: '#1a140e' }}
            onMouseEnter={e => { if (offset < maxOffset) { e.currentTarget.style.background = '#1a140e'; e.currentTarget.style.color = '#faf9f7'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a140e'; }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Track */}
      <div style={{ overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: GAP,
            padding: '8px 40px 16px',
            transform: `translateX(${-offset + dragOffset}px)`,
            transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
            willChange: 'transform',
            userSelect: 'none',
          }}
        >
          {productos.map(p => (
            <div key={p.id} style={{ flexShrink: 0, width: CARD_W }}>
              <ProductCard producto={p} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TestimonialsCarousel ───────────────────────────────────────────────────────
function TestimonialsCarousel() {
  const { current, go, prev, next } = useAutoSlide(testimonios.length, 5500);

  return (
    <section style={{ padding: '96px 24px', background: '#1a140e', overflow: 'hidden' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#b8945a', marginBottom: 16 }}>✦ Lo que dicen</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', color: '#faf9f7', margin: 0 }}>
            Voces de Clientes
          </h2>
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            transform: `translateX(-${current * 100}%)`,
            transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {testimonios.map((t, i) => (
              <div key={i} style={{ minWidth: '100%', padding: '0 4px' }}>
                <div style={{ textAlign: 'center', padding: '40px 32px', background: 'rgba(250,249,247,0.04)', border: '1px solid rgba(250,249,247,0.08)' }}>
                  <Quote size={32} color="#d4583a" style={{ marginBottom: 24, opacity: 0.6 }} />
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px,3vw,24px)', color: '#faf9f7', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 32 }}>
                    "{t.texto}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                    {[...Array(t.estrellas)].map((_, j) => (
                      <Star key={j} size={14} fill="#d4583a" color="#d4583a" />
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: '#b8945a', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>
                    {t.nombre}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(250,249,247,0.3)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    {t.ciudad}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 32 }}>
          <button onClick={prev} style={{ background: 'transparent', border: '1px solid rgba(250,249,247,0.15)', color: 'rgba(250,249,247,0.5)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4583a'; e.currentTarget.style.color = '#d4583a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,249,247,0.15)'; e.currentTarget.style.color = 'rgba(250,249,247,0.5)'; }}>
            <ChevronLeft size={16} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {testimonios.map((_, i) => (
              <button key={i} onClick={() => go(i)} style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#d4583a' : 'rgba(250,249,247,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
            ))}
          </div>
          <button onClick={next} style={{ background: 'transparent', border: '1px solid rgba(250,249,247,0.15)', color: 'rgba(250,249,247,0.5)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4583a'; e.currentTarget.style.color = '#d4583a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,249,247,0.15)'; e.currentTarget.style.color = 'rgba(250,249,247,0.5)'; }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── CategoryCards (mejorado con hover effect) ────────────────────────────────
function CategoryCards() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="categorias" style={{ padding: '96px 24px', background: '#faf9f7' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>lo que hacemos</span>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#1a140e', margin: 0 }}>
            Nuestras Categorías
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {categorias.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/productos?busqueda=${cat.id}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '40px 32px',
                border: `1px solid ${hovered === i ? '#d4583a' : '#e8e0d4'}`,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                background: hovered === i ? '#fdf8f3' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === i ? '0 12px 40px rgba(212,88,58,0.12)' : 'none',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: hovered === i ? '#d4583a' : '#f0ebe3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', transition: 'all 0.3s' }}>
                <cat.icon size={24} color={hovered === i ? '#faf9f7' : '#b8945a'} />
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1a140e', marginBottom: 12 }}>{cat.label}</h3>
              <p style={{ fontSize: 13, color: 'rgba(26,20,14,0.5)', lineHeight: 1.6, margin: 0 }}>{cat.desc}</p>
              <div style={{ marginTop: 24, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: hovered === i ? '#d4583a' : 'rgba(26,20,14,0.3)', transition: 'color 0.3s' }}>
                Ver productos →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = ['Macramé Artesanal', '✦', 'Tejidos en Telar', '✦', 'Papel Kraft', '✦', 'Hecho a Mano', '✦', 'Catamarca', '✦', 'Fibras Naturales', '✦', 'Piezas Únicas', '✦'];
  const doubled = [...items, ...items];

  return (
    <div style={{ background: '#d4583a', padding: '14px 0', overflow: 'hidden', borderTop: '1px solid rgba(250,249,247,0.1)', borderBottom: '1px solid rgba(250,249,247,0.1)' }}>
      <div style={{ display: 'flex', gap: 32, animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#faf9f7', flexShrink: 0 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [productos,  setProductos]  = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    fetch('/api/productos?page=1&pageSize=12')
      .then(r => r.json())
      .then(data => setProductos(data.productos ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const productosConStock = productos.filter(p => p.stock > 0);

  return (
    <main style={{ fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes tdFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tdShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .td-skeleton {
          background: linear-gradient(90deg, #f0ebe3 25%, #e8e0d4 50%, #f0ebe3 75%);
          background-size: 400px 100%;
          animation: tdShimmer 1.4s ease-in-out infinite;
          aspect-ratio: 1/1;
          min-height: 240px;
        }
        .td-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) { .td-products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .td-products-grid { grid-template-columns: 1fr; } }
        .td-stat-num {
          font-family: Georgia, serif;
          font-size: 48px;
          color: #d4583a;
          margin: 0 0 4px;
          font-weight: 600;
          line-height: 1;
        }
      `}</style>

      {/* ─── HERO SLIDER ─── */}
      {loading ? (
        <section style={{ minHeight: '100vh', background: '#1a140e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#faf9f7', margin: 0 }}>Tokio <em style={{ color: '#d4583a' }}>Deco</em></p>
            <div style={{ marginTop: 24, width: 48, height: 2, background: '#d4583a', margin: '24px auto 0' }} />
          </div>
        </section>
      ) : (
        <HeroSlider productos={productosConStock} />
      )}

      {/* ─── MARQUEE ─── */}
      <MarqueeStrip />

      {/* ─── CATEGORÍAS ─── */}
      <CategoryCards />

      {/* ─── FEATURED SLIDER ─── */}
      {!loading && productosConStock.length > 0 && (
        <FeaturedSlider productos={productosConStock} />
      )}

      {/* ─── TODOS LOS PRODUCTOS ─── */}
      <section id="productos" style={{ padding: '96px 24px', background: '#faf9f7' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>colección completa</span>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#1a140e', margin: 0 }}>
              Todos los Productos
            </h2>
            {!loading && (
              <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(26,20,14,0.4)' }}>
                {productos.length} {productos.length === 1 ? 'pieza disponible' : 'piezas disponibles'}
              </p>
            )}
          </div>

          {loading ? (
            <div className="td-products-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="td-skeleton" />)}
            </div>
          ) : productos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: 'rgba(26,20,14,0.3)', fontStyle: 'italic' }}>
                Pronto habrá nuevas piezas disponibles
              </p>
            </div>
          ) : (
            <>
              <div className="td-products-grid">
                {productos.map(p => <ProductCard key={p.id} producto={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <Link href="/productos" style={{ border: '1px solid rgba(26,20,14,0.3)', color: '#1a140e', padding: '14px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1a140e'; e.currentTarget.style.color = '#faf9f7'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a140e'; }}>
                  Ver catálogo completo
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── HISTORIA ─── */}
      <section id="historia" style={{ padding: '96px 24px', background: '#1a140e', color: '#faf9f7', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden', maxWidth: 384, margin: '0 auto' }}>
                <img src="/silvia.heic" alt="Fundadora Tokio Deco" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,20,14,0.7), rgba(26,20,14,0.2), transparent)' }} />
                <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'repeating-linear-gradient(0deg, #b8945a 0px, #b8945a 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, #b8945a 0px, #b8945a 1px, transparent 1px, transparent 12px)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: 32, textAlign: 'center' }}>
                  <div style={{ width: 48, height: 1, background: 'rgba(212,88,58,0.5)', marginBottom: 24 }} />
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', color: 'rgba(250,249,247,0.5)', lineHeight: 1.6, maxWidth: 200 }}>
                    "Las manos crean lo que el corazón siente"
                  </p>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -16, right: -16, width: 128, height: 128, border: '1px solid rgba(212,88,58,0.3)' }} />
              <div style={{ position: 'absolute', top: -16, left: -16, width: 80, height: 80, border: '1px solid rgba(184,148,90,0.2)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>nuestra historia</span>
                <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#faf9f7', marginBottom: 32, lineHeight: 1.15 }}>
                Raíces en el norte,<br />
                <em style={{ color: '#d4583a', fontStyle: 'italic' }}>arte en las manos</em>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 14, color: 'rgba(250,249,247,0.7)', lineHeight: 1.8 }}>
                <p style={{ margin: 0 }}>Crecí en Catamarca, una tierra donde la tradición artesanal forma parte del paisaje cotidiano. Hace 5 años descubrí una conexión especial con los materiales nobles y los procesos hechos a mano.</p>
                <p style={{ margin: 0 }}>Con el tiempo encontré en el macramé, el tejido artesanal y el trabajo en fibras mi propio lenguaje. Cada nudo, cada trama, cada pieza es una conversación entre mis manos y las técnicas.</p>
                <p style={{ margin: 0 }}><strong style={{ color: '#faf9f7' }}>Tokio Deco</strong> nació de ese amor profundo por lo hecho a mano. Un nombre que mezcla lo lejano con lo propio.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, marginTop: 48, paddingTop: 40, borderTop: '1px solid rgba(250,249,247,0.1)' }}>
                {[{ num: '+200', label: 'Piezas creadas' }, { num: '5+', label: 'Años de experiencia' }, { num: '100%', label: 'Artesanal' }].map(({ num, label }, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p className="td-stat-num">{num}</p>
                    <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(250,249,247,0.35)', margin: 0 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALORES ─── */}
      <section style={{ padding: '96px 24px', background: '#fdf8f3' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>lo que nos mueve</span>
              <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 40px)', color: '#1a140e', margin: 0 }}>
              Nuestra Forma de Hacer
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
            {[
              { n: '01', title: 'Materiales del norte',  desc: 'Fibras naturales de la región — algodón, yute y lana — porque la tierra de Catamarca tiene mucho para dar.' },
              { n: '02', title: 'Sin moldes ni prisa',   desc: 'Cada diseño nace libre, sin patrones fijos. La creatividad no entiende de apuros.' },
              { n: '03', title: 'Tejido a mano',         desc: 'Nudo por nudo, hilo por hilo. El tiempo que lleva cada pieza es parte de su valor.' },
              { n: '04', title: 'Con identidad propia',  desc: 'Cada objeto refleja la cultura del noroeste argentino. Arte que cuenta de dónde viene.' },
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 56, color: '#e8e0d4', lineHeight: 1 }}>{step.n}</span>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1a140e', margin: 0 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(26,20,14,0.5)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIOS ─── */}
      <TestimonialsCarousel />

      {/* ─── FRASE ─── */}
      <section style={{ padding: '80px 24px', background: '#d4583a' }}>
        <div style={{ maxWidth: 768, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 4vw, 44px)', color: '#faf9f7', fontStyle: 'italic', lineHeight: 1.4, margin: '0 0 32px' }}>
            "Cada pieza que sale de mis manos
            <br />
            <span style={{ fontStyle: 'normal', fontSize: '0.85em', opacity: 0.85 }}>lleva un pedacito de Catamarca."</span>
          </p>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(250,249,247,0.6)', margin: 0 }}>
            — Fundadora de Tokio Deco
          </p>
        </div>
      </section>

      {/* ─── CONTACTO ─── */}
      <section id="contacto" style={{ padding: '96px 24px', background: '#faf9f7' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>hablemos</span>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#1a140e', marginBottom: 24 }}>
            ¿Querés una pieza personalizada?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(26,20,14,0.6)', lineHeight: 1.7, marginBottom: 48 }}>
            Hago piezas a pedido con las medidas, colores y materiales que elijas.
            Escribime y juntas creamos algo único.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola! Me gustaría consultar sobre una pieza personalizada de Tokio Deco')}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#5f8f4e', color: '#faf9f7', padding: '16px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4a7040'}
              onMouseLeave={e => e.currentTarget.style.background = '#5f8f4e'}>
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(26,20,14,0.3)', color: '#1a140e', padding: '16px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a140e'; e.currentTarget.style.color = '#faf9f7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a140e'; }}>
              <Instagram size={16} /> Instagram
            </a>
            <a href={`mailto:${EMAIL}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(26,20,14,0.3)', color: '#1a140e', padding: '16px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a140e'; e.currentTarget.style.color = '#faf9f7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a140e'; }}>
              <Mail size={16} /> Email
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
