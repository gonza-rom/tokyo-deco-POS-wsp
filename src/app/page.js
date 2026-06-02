'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Package, Leaf, Shield, Plus, Minus, Share2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';

// ── Colores Tokio Deco + Mundial 2026 ─────────────────────────────────────
const C = {
  carbon:     '#1a140e',
  crema:      '#faf9f7',
  arena:      '#f0ebe3',
  arenaBorder:'#e8e0d4',
  arenaText:  '#b8945a',
  terracota:  '#d4583a',
  salvia:     '#5f8f4e',
  muted:      'rgba(26,20,14,0.5)',
  mutedLight: 'rgba(26,20,14,0.25)',
  // ── Selección Argentina 2026 ──
  celeste:    '#74acdf',
  celesteOsc: '#4a8fc1',
  blanco:     '#ffffff',
};

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n ?? 0);

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5493834540245';

const WhatsAppIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// ── Badge Mundial ─────────────────────────────────────────────────────────
function MundialBadge() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: C.celeste, color: C.blanco,
      padding: '4px 12px', fontSize: 10,
      fontFamily: 'Inter, sans-serif', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.2em',
      marginBottom: 12,
    }}>
      <span>🇦🇷</span> Mundial 2026
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────
function ProductTabs({ producto }) {
  const [active, setActive] = useState(0);
  const tabs = ['Descripción', 'Materiales', 'Cuidados'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.arenaBorder}`, marginBottom: 20 }}>
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActive(i)} style={{
            padding: '10px 20px',
            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            background: 'none', border: 'none',
            borderBottom: active === i ? `2px solid ${C.celeste}` : '2px solid transparent',
            color: active === i ? C.celesteOsc : C.muted,
            cursor: 'pointer', transition: 'all 0.15s',
            marginBottom: -1,
          }}>{tab}</button>
        ))}
      </div>

      {active === 0 && (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
          {producto.descripcion
            ? <p style={{ margin: 0 }}>{producto.descripcion}</p>
            : <p style={{ margin: 0, fontStyle: 'italic' }}>Sin descripción disponible.</p>
          }
        </div>
      )}
      {active === 1 && (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
          {producto.material
            ? <p style={{ margin: 0 }}>{producto.material}</p>
            : <p style={{ margin: 0, fontStyle: 'italic' }}>Materiales naturales de la región.</p>
          }
        </div>
      )}
      {active === 2 && (
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
          <p style={{ margin: '0 0 8px' }}>Para mantener tu pieza en óptimas condiciones:</p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Guardá en lugar seco y ventilado</li>
            <li>Evitá exposición prolongada al sol</li>
            <li>Limpiá suavemente con paño húmedo</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Valores artesanales ───────────────────────────────────────────────────
function ValoresSection({ producto }) {
  return (
    <section style={{
      margin: '64px 0',
      padding: '48px',
      background: C.celesteOsc,
      borderTop: `6px solid ${C.blanco}`,
      borderBottom: `6px solid ${C.blanco}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.5)' }} />
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>hecho a mano</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40 }}>
        {[
          { icon: Leaf,    title: 'Materiales naturales', desc: 'Fibras de la región — algodón, yute y lana catamarqueña.' },
          { icon: Package, title: 'Pieza única',          desc: 'Cada objeto es irrepetible. No existen dos iguales.' },
          { icon: Shield,  title: 'Calidad garantizada',  desc: 'Si no quedás satisfecho, lo resolvemos juntos.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title}>
            <Icon size={22} color={C.blanco} style={{ marginBottom: 12 }} />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: C.blanco, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page principal ────────────────────────────────────────────────────────
export default function ProductoDetallePage() {
  const params  = useParams();
  const router  = useRouter();
  const [producto,              setProducto]              = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [loading,               setLoading]               = useState(true);
  const [error,                 setError]                 = useState(null);
  const [cantidad,              setCantidad]              = useState(1);
  const [agregado,              setAgregado]              = useState(false);
  const { addToCart } = useCart();

  useEffect(() => { if (params.id) fetchProducto(); }, [params.id]);

  const fetchProducto = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(`/api/productos/${params.id}`);
      if (!res.ok) { setError(res.status === 404 ? 'not_found' : 'error'); return; }
      const data = await res.json();
      setProducto(data);
      fetchRelacionados(data.categoriaId, data.id);
    } catch { setError('error'); } finally { setLoading(false); }
  };

  const fetchRelacionados = async (categoriaId, productoId) => {
    try {
      const res  = await fetch('/api/productos');
      const data = await res.json();
      const todos = Array.isArray(data) ? data : (data.productos ?? []);
      setProductosRelacionados(todos.filter(p => p.categoriaId === categoriaId && p.id !== productoId).slice(0, 4));
    } catch {}
  };

  const handleAgregarCarrito = () => {
    if (!producto) return;
    addToCart(producto, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!producto) return;
    const msg = encodeURIComponent(
      `¡Hola! Me interesa esta pieza:\n\n*${producto.nombre}*\nCantidad: ${cantidad}\nTotal: ${fmt(producto.precio * cantidad)}\n\n¿Está disponible?`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  const handleCompartir = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: producto.nombre, url }); } catch {} }
    else { try { await navigator.clipboard.writeText(url); } catch {} }
  };

  // ── Loading ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.crema, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `2px solid ${C.arenaBorder}`, borderTopColor: C.celeste, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', color: C.arenaText }}>Cargando pieza…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Error ──
  if (error || !producto) return (
    <div style={{ minHeight: '100vh', background: C.crema, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 400, textAlign: 'center', border: `1px solid ${C.arenaBorder}`, padding: 48, background: C.arena }}>
        <ShoppingBag size={48} color={C.arenaBorder} style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: C.carbon, marginBottom: 12 }}>
          {error === 'not_found' ? 'Pieza no encontrada' : 'Error al cargar'}
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.7 }}>
          {error === 'not_found' ? 'La pieza que buscás no existe o fue eliminada.' : 'Hubo un problema. Por favor, intentá de nuevo.'}
        </p>
        <Link href="/productos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.terracota, color: C.crema, padding: '12px 32px', fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Ver colección
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.crema }}>

      {/* Breadcrumb */}
      <div style={{ background: C.arena, borderBottom: `1px solid ${C.arenaBorder}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          <Link href="/"          style={{ color: C.muted, textDecoration: 'none' }}>Inicio</Link>
          <span style={{ color: C.mutedLight }}>›</span>
          <Link href="/productos" style={{ color: C.muted, textDecoration: 'none' }}>Colección</Link>
          {producto.categoria && (
            <>
              <span style={{ color: C.mutedLight }}>›</span>
              <Link href={`/productos?categoria=${producto.categoriaId}`} style={{ color: C.muted, textDecoration: 'none' }}>{producto.categoria.nombre}</Link>
            </>
          )}
          <span style={{ color: C.mutedLight }}>›</span>
          <span style={{ color: C.arenaText }}>{producto.nombre}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

        {/* Volver */}
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 40 }}>
          <ArrowLeft size={14} /> Volver
        </button>

        {/* ── Grid principal ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, marginBottom: 32 }}>

          {/* Galería */}
          <div>
            <ProductGallery producto={producto} />
            <button onClick={handleCompartir} style={{ width: '100%', marginTop: 12, padding: '12px', background: 'none', border: `1px solid ${C.arenaBorder}`, fontFamily: 'Inter, sans-serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
              <Share2 size={13} /> Compartir pieza
            </button>
          </div>

          {/* Info panel */}
          <div style={{ position: 'sticky', top: 96, alignSelf: 'start' }}>
            <div style={{ background: C.arena, border: `1px solid ${C.arenaBorder}`, padding: '40px' }}>

              {/* Badge Mundial */}
              <MundialBadge />

              {/* Categoría */}
              {producto.categoria && (
                <Link href={`/productos?categoria=${producto.categoriaId}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.arenaText, textDecoration: 'none', display: 'block', marginBottom: 16 }}>
                  {producto.categoria.nombre}
                </Link>
              )}

              {/* Nombre */}
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 3vw, 36px)', color: C.carbon, lineHeight: 1.2, marginBottom: 8 }}>
                {producto.nombre}
              </h1>
              {producto.codigoProducto && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: C.muted, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  REF: {producto.codigoProducto}
                </p>
              )}

              {/* Precio */}
              <div style={{ borderTop: `1px solid ${C.arenaBorder}`, borderBottom: `1px solid ${C.arenaBorder}`, padding: '20px 0', margin: '0 0 24px' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: C.terracota, margin: 0, fontWeight: 600 }}>
                  {fmt(producto.precio)}
                </p>
              </div>

              {/* Stock */}
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24,
                color: producto.stock > 0 ? C.salvia : C.terracota }}>
                {producto.stock > 0 ? `✓ Disponible — ${producto.stock} unidades` : '✕ Sin stock'}
              </p>

              {/* Cantidad */}
              {producto.stock > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.muted, marginBottom: 12 }}>Cantidad</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', border: `1px solid ${C.arenaBorder}` }}>
                      <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', color: C.carbon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={14} />
                      </button>
                      <input
                        type="number" value={cantidad}
                        onChange={e => setCantidad(Math.max(1, Math.min(producto.stock, parseInt(e.target.value) || 1)))}
                        style={{ width: 48, textAlign: 'center', border: 'none', borderLeft: `1px solid ${C.arenaBorder}`, borderRight: `1px solid ${C.arenaBorder}`, background: C.crema, fontFamily: 'Georgia, serif', fontSize: 16, color: C.carbon, outline: 'none' }}
                        min="1" max={producto.stock}
                      />
                      <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', color: C.carbon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: C.terracota, margin: 0 }}>
                      {fmt(producto.precio * cantidad)}
                    </p>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {producto.stock > 0 ? (
                  <>
                    <motion.button
                      onClick={handleAgregarCarrito}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%', padding: '16px',
                        background: agregado ? C.salvia : `linear-gradient(135deg, ${C.celeste} 0%, ${C.celesteOsc} 100%)`,
                        color: C.blanco, border: 'none',
                        fontFamily: 'Inter, sans-serif', fontSize: 12,
                        textTransform: 'uppercase', letterSpacing: '0.2em',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 10, transition: 'background 0.2s',
                      }}
                    >
                      <ShoppingBag size={16} />
                      <AnimatePresence mode="wait">
                        <motion.span key={agregado ? 'ok' : 'add'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                          {agregado ? '¡Agregado!' : 'Agregar al carrito'}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                    <button onClick={handleWhatsApp} style={{
                      width: '100%', padding: '14px',
                      background: C.salvia, color: C.crema,
                      border: `2px solid ${C.celeste}`,
                      fontFamily: 'Inter, sans-serif', fontSize: 12,
                      textTransform: 'uppercase', letterSpacing: '0.2em',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 10,
                    }}>
                      <WhatsAppIcon /> Consultar por WhatsApp
                    </button>
                  </>
                ) : (
                  <button onClick={handleWhatsApp} style={{ width: '100%', padding: '16px', background: C.arenaText, color: C.crema, border: 'none', fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <MessageCircle size={16} /> Consultar disponibilidad
                  </button>
                )}
              </div>

              {/* Tabs */}
              <ProductTabs producto={producto} />
            </div>
          </div>
        </div>

        {/* Valores */}
        <ValoresSection producto={producto} />

        {/* Relacionados */}
        {productosRelacionados.length > 0 && (
          <section style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
              <div style={{ width: 32, height: 2, background: C.celeste }} />
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', color: C.celeste }}>también te puede gustar</span>
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: C.carbon, marginBottom: 32 }}>
              Piezas relacionadas
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
              {productosRelacionados.map(p => (
                <ProductCard key={p.id} producto={p} onAddToCart={addToCart} />
              ))}
            </div>
            {producto.categoria && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link href={`/productos?categoria=${producto.categoriaId}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.terracota, textDecoration: 'none', borderBottom: `1px solid ${C.terracota}`, paddingBottom: 4 }}>
                  Ver toda la categoría →
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
