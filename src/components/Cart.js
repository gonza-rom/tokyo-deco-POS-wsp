'use client';

import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const WA_NUMBER = '5493834540245';

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

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n ?? 0);

export default function Cart() {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
  } = useCart();

  const enviarPorWhatsApp = () => {
    if (!cart.length) return;

    const lineas = cart.map(
      (item) =>
        `• ${item.nombre} x${item.cantidad} — ${fmt(item.precio * item.cantidad)}`
    );

    const mensaje =
      `¡Hola! Quisiera consultar por los siguientes productos:\n\n` +
      lineas.join('\n') +
      `\n\n*Total: ${fmt(getTotal())}*\n\n¿Están disponibles?`;

    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,20,14,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
        }}
      />

      {/* Panel */}
      <div
        className="cart-panel"
        style={{
          position: 'fixed', right: 0, top: 0, height: '100%',
          width: '100%', maxWidth: '420px',
          background: C.crema,
          boxShadow: '-8px 0 48px rgba(26,20,14,0.12)',
          zIndex: 50,
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${C.arenaBorder}`,
          background: C.arena,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 24, height: 1, background: C.arenaText }} />
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 12, fontStyle: 'italic', color: C.arenaText }}>tu selección</span>
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: C.carbon, margin: 0 }}>
              Carrito
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none', border: `1px solid ${C.arenaBorder}`,
              width: '2.25rem', height: '2.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: C.muted,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%',
              gap: '1rem', paddingBottom: '4rem', textAlign: 'center',
            }}>
              <ShoppingBag size={56} color={C.arenaBorder} strokeWidth={1} />
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: C.muted, fontStyle: 'italic' }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: C.muted }}>
                Explorá la colección y agregá piezas
              </p>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginTop: '0.5rem', padding: '10px 28px',
                  background: C.terracota, color: C.crema, border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.7rem',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  cursor: 'pointer',
                }}
              >
                Ver colección
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => (
                <div key={item.id} className="cart-item" style={{
                  display: 'flex', gap: '1rem',
                  background: C.arena,
                  border: `1px solid ${C.arenaBorder}`,
                  padding: '1rem',
                }}>
                  {/* Imagen */}
                  <div style={{
                    position: 'relative', width: '72px', height: '90px',
                    background: C.arenaBorder, overflow: 'hidden', flexShrink: 0,
                  }}>
                    {item.imagen ? (
                      <Image src={item.imagen} alt={item.nombre} fill style={{ objectFit: 'cover' }} sizes="72px" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={24} color={C.arenaBorder} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBlock: '0.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div>
                        {item.categoria && (
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', color: C.arenaText, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 4 }}>
                            {item.categoria.nombre ?? item.categoria}
                          </p>
                        )}
                        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: C.carbon, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {item.nombre}
                        </h3>
                      </div>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 600, color: C.terracota, whiteSpace: 'nowrap' }}>
                        {fmt(item.precio * item.cantidad)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                      {/* Cantidad */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        border: `1px solid ${C.arenaBorder}`,
                        background: C.crema,
                      }}>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, minWidth: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: C.carbon, borderLeft: `1px solid ${C.arenaBorder}`, borderRight: `1px solid ${C.arenaBorder}`, lineHeight: '28px' }}>
                          {item.cantidad}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Eliminar */}
                      <button
                        className="cart-delete"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          color: C.muted, background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
                          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                          padding: '0.3rem 0.5rem',
                        }}
                      >
                        <Trash2 size={12} /> Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.arenaBorder}`, background: C.arena, padding: '1.5rem' }}>

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: C.muted }}>
              <span>{cart.reduce((a, i) => a + i.cantidad, 0)} {cart.length === 1 ? 'pieza' : 'piezas'}</span>
              <span>{fmt(getTotal())}</span>
            </div>

            <div style={{ height: 1, background: C.arenaBorder, margin: '12px 0' }} />

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: C.muted }}>Total</span>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 600, color: C.terracota, margin: 0, lineHeight: 1 }}>
                {fmt(getTotal())}
              </p>
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={enviarPorWhatsApp}
              style={{
                width: '100%', padding: '1rem',
                background: C.salvia, color: C.crema,
                border: 'none', cursor: 'pointer', marginBottom: '0.75rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#4a7040'}
              onMouseLeave={e => e.currentTarget.style.background = C.salvia}
            >
              <MessageCircle size={17} />
              Consultar por WhatsApp
            </button>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: C.muted, textAlign: 'center', lineHeight: 1.6, marginBottom: '1rem' }}>
              Te enviamos la lista de productos al WhatsApp de Tokio Deco
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: C.muted, background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                ← Seguir viendo
              </button>
              <button
                className="clear-btn"
                onClick={clearCart}
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700,
                  color: C.muted, background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.4rem 0.75rem',
                }}
              >
                Vaciar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}