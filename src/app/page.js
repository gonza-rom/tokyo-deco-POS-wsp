'use client';
// src/app/page.js
// Home de Tokio Deco — datos desde DevHub POS via /api/productos

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MessageCircle, Mail, Leaf, Scissors, Wind, Star, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const WA_NUMBER  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5493834327903';
const INSTAGRAM  = 'tokio_decoar';
const EMAIL      = 'hola@tokiodeco.com.ar';

const categorias = [
  { id: 'macrame',   label: 'Macramé',  icon: Wind,     desc: 'Tejidos artesanales en hilo de algodón y yute' },
  { id: 'kraft',     label: 'Kraft',    icon: Scissors, desc: 'Diseños únicos sobre papel kraft y materiales naturales' },
  { id: 'textiles',  label: 'Textiles', icon: Leaf,     desc: 'Tapices y tejidos en telar con fibras naturales' },
];

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n ?? 0);

// ── ProductCard Tokio Deco ────────────────────────────────────────────────────
function ProductCard({ producto }) {
  const { addToCart } = useCart();

  const imagen = producto.imagenes?.[0] ?? producto.imagen ?? null;
  const waMsg  = encodeURIComponent(
    `Hola! Me interesa el producto: ${producto.nombre} (${fmt(producto.precio)})`
  );

  return (
    <div style={{
      background: '#faf9f7',
      border: '1px solid #e8e0d4',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Imagen */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f0ebe3', overflow: 'hidden' }}>
        {imagen ? (
          <Image
            src={imagen}
            alt={producto.nombre}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={48} color="#c4b49a" />
          </div>
        )}
        {producto.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,20,14,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#faf9f7', fontFamily: 'Georgia, serif', fontSize: 18 }}>Sin stock</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {producto.categoria?.nombre && (
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#b8945a', margin: 0 }}>
            {producto.categoria.nombre}
          </p>
        )}
        <Link href={`/productos/${producto.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1a140e', margin: 0, lineHeight: 1.3 }}>
            {producto.nombre}
          </h3>
        </Link>
        {producto.descripcion && (
          <p style={{ fontSize: 13, color: '#7a6a5a', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {producto.descripcion}
          </p>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #e8e0d4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#d4583a', margin: 0, fontWeight: 600 }}>
            {fmt(producto.precio)}
          </p>
          {producto.stock > 0 ? (
            <button
              onClick={() => addToCart(producto, 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#5f8f4e', color: '#faf9f7',
                border: 'none', padding: '8px 16px',
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

  const destacados = productos.filter(p => p.stock > 0).slice(0, 3);

  return (
    <main style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ─── ESTILOS GLOBALES DE TOKIO DECO ─── */}
      <style>{`
        .td-fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: tdFadeUp 0.7s ease forwards;
        }
        @keyframes tdFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .td-btn-terracota {
          background: #d4583a;
          color: #faf9f7;
          padding: 14px 32px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
          font-family: Inter, sans-serif;
        }
        .td-btn-terracota:hover { background: #b84a2e; }
        .td-btn-outline {
          border: 1px solid rgba(26,20,14,0.3);
          color: #1a140e;
          padding: 14px 32px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
          background: transparent;
        }
        .td-btn-outline:hover { background: #1a140e; color: #faf9f7; border-color: #1a140e; }
        .td-ornament {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: center;
          margin-bottom: 24px;
        }
        .td-ornament::before, .td-ornament::after {
          content: '';
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: #c4b49a;
        }
        .td-cat-card {
          padding: 32px;
          border: 1px solid #e8e0d4;
          text-align: center;
          text-decoration: none;
          display: block;
          transition: all 0.3s;
          background: transparent;
        }
        .td-cat-card:hover {
          border-color: #d4583a;
          background: #fdf8f3;
        }
        .td-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) { .td-products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .td-products-grid { grid-template-columns: 1fr; } }
        .td-skeleton {
          background: linear-gradient(90deg, #f0ebe3 25%, #e8e0d4 50%, #f0ebe3 75%);
          background-size: 400px 100%;
          animation: tdShimmer 1.4s ease-in-out infinite;
          aspect-ratio: 4/3;
        }
        @keyframes tdShimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
      `}</style>

      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden', background: '#fdf8f3',
      }}>
        {/* Fondo decorativo */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #d4583a 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #5f8f4e 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, #b8945a 0%, transparent 35%)
          `,
        }} />

        {/* SVG decorativo derecha */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 500 500" style={{ width: 384, height: 384, opacity: 0.08 }} xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="230" fill="none" stroke="#b8945a" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="#d4583a" strokeWidth="1" />
            <circle cx="250" cy="250" r="130" fill="none" stroke="#b8945a" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="80"  fill="none" stroke="#d4583a" strokeWidth="1" />
            <circle cx="250" cy="250" r="30"  fill="none" stroke="#b8945a" strokeWidth="1.5" />
            <line x1="20"  y1="250" x2="480" y2="250" stroke="#b8945a" strokeWidth="0.8" />
            <line x1="250" y1="20"  x2="250" y2="480" stroke="#b8945a" strokeWidth="0.8" />
            <line x1="87"  y1="87"  x2="413" y2="413" stroke="#b8945a" strokeWidth="0.5" />
            <line x1="413" y1="87"  x2="87"  y2="413" stroke="#b8945a" strokeWidth="0.5" />
          </svg>
        </div>

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '128px 24px', width: '100%' }}>
          <div style={{ maxWidth: 520 }}>
            <p className="td-fade-up" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#d4583a', marginBottom: 24, animationDelay: '0.1s' }}>
              ✦ Artesanías & Textiles · Catamarca
            </p>
            <h1 className="td-fade-up" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(64px, 10vw, 96px)', color: '#1a140e', lineHeight: 0.9, marginBottom: 32, animationDelay: '0.25s' }}>
              Tokio
              <br />
              <em style={{ color: '#d4583a', fontStyle: 'normal' }}>Deco</em>
            </h1>
            <p className="td-fade-up" style={{ fontSize: 15, color: 'rgba(26,20,14,0.6)', lineHeight: 1.7, maxWidth: 380, marginBottom: 40, animationDelay: '0.4s' }}>
              Piezas únicas hechas a mano con amor y materiales naturales. Cada objeto lleva la huella de quien lo creó.
            </p>
            <div className="td-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, animationDelay: '0.55s' }}>
              <Link href="/productos" className="td-btn-terracota">Ver colección</Link>
              <a href="#historia" className="td-btn-outline">Nuestra historia</a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#1a140e' }}>Scroll</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, #1a140e, transparent)' }} />
        </div>
      </section>

      {/* ─── CATEGORÍAS ─── */}
      <section id="categorias" style={{ padding: '96px 24px', background: '#faf9f7' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="td-ornament">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>lo que hacemos</span>
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#1a140e', margin: 0 }}>
              Nuestras Categorías
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {categorias.map(cat => (
              <Link key={cat.id} href={`/productos?busqueda=${cat.id}`} className="td-cat-card">
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0ebe3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <cat.icon size={22} color="#b8945a" />
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1a140e', marginBottom: 12 }}>{cat.label}</h3>
                <p style={{ fontSize: 13, color: 'rgba(26,20,14,0.5)', lineHeight: 1.6, margin: 0 }}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TODOS LOS PRODUCTOS ─── */}
      <section id="productos" style={{ padding: '96px 24px', background: '#faf9f7' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="td-ornament">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>colección completa</span>
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
                <Link href="/productos" className="td-btn-outline">Ver catálogo completo</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── HISTORIA ─── */}
      <section id="historia" style={{ padding: '96px 24px', background: '#1a140e', color: '#faf9f7', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

            {/* Foto */}
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden', maxWidth: 384, margin: '0 auto' }}>
                <img
                  src="/silvia.heic"
                  alt="Fundadora Tokio Deco"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
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

            {/* Texto */}
            <div>
              <div className="td-ornament" style={{ justifyContent: 'flex-start' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>nuestra historia</span>
                <div style={{ flex: 1, maxWidth: 60, height: 1, background: '#c4b49a' }} />
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#faf9f7', marginBottom: 32, lineHeight: 1.15 }}>
                Raíces en el norte,<br />
                <em style={{ color: '#d4583a', fontStyle: 'italic' }}>arte en las manos</em>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 14, color: 'rgba(250,249,247,0.7)', lineHeight: 1.8 }}>
                <p style={{ margin: 0 }}>
                  Crecí en Catamarca, una tierra donde la tradición artesanal forma
                  parte del paisaje cotidiano. Hace 5 años descubrí una conexión especial con
                  los materiales nobles y los procesos hechos a mano.
                </p>
                <p style={{ margin: 0 }}>
                  Con el tiempo encontré en el macramé, el tejido artesanal y el trabajo en
                  fibras mi propio lenguaje. Cada nudo, cada trama, cada pieza es una
                  conversación entre mis manos y las técnicas.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#faf9f7' }}>Tokio Deco</strong> nació de ese amor profundo
                  por lo hecho a mano. Un nombre que mezcla lo lejano con lo propio — igual que las
                  piezas que creamos: con alma catamarqueña y una estética que atraviesa fronteras.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 40 }}>
                {[
                  { num: '+200', label: 'Piezas creadas' },
                  { num: '5+',   label: 'Años de experiencia' },
                  { num: '100%', label: 'Artesanal' },
                ].map(({ num, label }, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#d4583a', margin: '0 0 4px', fontWeight: 600 }}>{num}</p>
                    <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(250,249,247,0.4)', margin: 0 }}>{label}</p>
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
            <div className="td-ornament">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>lo que nos mueve</span>
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
          <div className="td-ornament">
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontStyle: 'italic', color: '#b8945a' }}>hablemos</span>
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
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#5f8f4e', color: '#faf9f7', padding: '16px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', transition: 'background 0.2s' }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(26,20,14,0.3)', color: '#1a140e', padding: '16px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', transition: 'all 0.2s' }}>
              <Instagram size={16} /> Instagram
            </a>
            <a href={`mailto:${EMAIL}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(26,20,14,0.3)', color: '#1a140e', padding: '16px 32px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none', transition: 'all 0.2s' }}>
              <Mail size={16} /> Email
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}