'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { getImagenesValidas } from './ProductGallery';
import { formatPrecio } from '@/lib/utils';

const C = {
  carbon:      '#1a140e',
  crema:       '#faf9f7',
  arena:       '#f0ebe3',
  arenaBorder: '#e8e0d4',
  arenaText:   '#b8945a',
  terracota:   '#d4583a',
  salvia:      '#5f8f4e',
  muted:       'rgba(26,20,14,0.5)',
};

export default function ProductCard({ producto, onAddToCart }) {
  const images         = getImagenesValidas(producto);
  const imagenPrincipal = images[0] || null;

  return (
    <div
      className="td-card"
      style={{
        background: C.crema,
        border: `1px solid ${C.arenaBorder}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,20,14,0.08)';
        e.currentTarget.style.borderColor = C.arenaText;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = C.arenaBorder;
      }}
    >
      {/* ── Imagen ── */}
      <div style={{ position: 'relative', background: C.arena, aspectRatio: '4/5', overflow: 'hidden' }}>
        <Link
          href={`/productos/${producto.id}`}
          style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}
        >
          {imagenPrincipal ? (
            <Image
              src={imagenPrincipal}
              alt={producto.nombre}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
              sizes="(max-width: 768px) 50vw, 25vw"
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.arena }}>
              <ShoppingBag size={40} color={C.arenaBorder} strokeWidth={1} />
            </div>
          )}
        </Link>

        {/* Badge cantidad de fotos */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            background: 'rgba(26,20,14,0.55)', color: C.crema,
            fontFamily: 'Inter, sans-serif', fontSize: '0.6rem',
            fontWeight: 700, padding: '0.2rem 0.5rem',
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            letterSpacing: '0.05em',
          }}>
            <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            {images.length}
          </div>
        )}

        {/* Sin stock */}
        {producto.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(26,20,14,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: C.crema, color: C.carbon,
              fontFamily: 'Georgia, serif', fontSize: '0.875rem',
              padding: '0.5rem 1.25rem',
            }}>
              Sin stock
            </span>
          </div>
        )}

        {/* Botón agregar */}
        <button
          className="td-card-add"
          onClick={(e) => { e.preventDefault(); onAddToCart(producto, 1); }}
          disabled={producto.stock === 0}
          title={producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          style={{
            position: 'absolute', bottom: '0.75rem', right: '0.75rem',
            width: '2.5rem', height: '2.5rem',
            background: C.crema,
            border: `1px solid ${C.arenaBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: producto.stock === 0 ? 'not-allowed' : 'pointer',
            opacity: 0, transform: 'translateY(8px)',
            transition: 'opacity 0.25s, transform 0.25s, background 0.2s',
            color: C.carbon,
          }}
          onMouseEnter={e => {
            if (producto.stock > 0) {
              e.currentTarget.style.background = C.terracota;
              e.currentTarget.style.color = C.crema;
              e.currentTarget.style.borderColor = C.terracota;
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = C.crema;
            e.currentTarget.style.color = C.carbon;
            e.currentTarget.style.borderColor = C.arenaBorder;
          }}
        >
          <ShoppingBag size={16} />
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{
        padding: '1rem',
        flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem',
      }}>
        {producto.categoria && (
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.arenaText, margin: 0,
          }}>
            {producto.categoria.nombre}
          </p>
        )}

        <Link
          href={`/productos/${producto.id}`}
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.9rem', color: C.carbon,
            textDecoration: 'none', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.terracota}
          onMouseLeave={e => e.currentTarget.style.color = C.carbon}
        >
          {producto.nombre}
        </Link>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.1rem', fontWeight: 600,
          color: C.terracota, margin: '0.35rem 0 0',
        }}>
          {formatPrecio(producto.precio)}
        </p>

        <Link
          href={`/productos/${producto.id}`}
          style={{
            marginTop: '0.75rem',
            padding: '0.55rem',
            border: `1px solid ${C.arenaBorder}`,
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: C.muted, textDecoration: 'none',
            display: 'block', textAlign: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = C.carbon;
            e.currentTarget.style.color = C.crema;
            e.currentTarget.style.borderColor = C.carbon;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = C.muted;
            e.currentTarget.style.borderColor = C.arenaBorder;
          }}
        >
          Ver pieza
        </Link>
      </div>

      {/* Estilos hover para el botón add (requiere CSS) */}
      <style>{`
        .td-card:hover .td-card-add {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}