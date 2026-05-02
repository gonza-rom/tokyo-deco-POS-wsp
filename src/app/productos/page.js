'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShoppingBag, Search, X, SlidersHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

const PAGE_SIZE = 12;

// ── Colores Tokio Deco ────────────────────────────────────────────────────
const C = {
  carbon:     '#1a140e',
  crema:      '#faf9f7',
  arena:      '#f0ebe3',
  arenaBorder:'#e8e0d4',
  arenaText:  '#b8945a',
  terracota:  '#d4583a',
  salvia:     '#5f8f4e',
  muted:      'rgba(26,20,14,0.5)',
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Paginación ────────────────────────────────────────────────────────────
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, pageSize } = pagination;
  const desde = (page - 1) * pageSize + 1;
  const hasta = Math.min(page * pageSize, total);

  const getPages = () => {
    const range = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++)
      range.push(i);
    return range;
  };

  const navBtn = (disabled) => ({
    padding: '0.5rem', border: 'none', background: 'transparent',
    color: disabled ? C.arenaBorder : C.muted,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center',
  });

  const pageBtn = (active) => ({
    width: '2.25rem', height: '2.25rem', border: active ? 'none' : `1px solid ${C.arenaBorder}`,
    background: active ? C.terracota : 'transparent',
    color: active ? C.crema : C.carbon,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem', fontWeight: active ? 700 : 400,
    cursor: 'pointer',
  });

  return (
    <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: C.muted }}>
        Mostrando <strong style={{ color: C.carbon }}>{desde}–{hasta}</strong> de{' '}
        <strong style={{ color: C.carbon }}>{total}</strong> piezas
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <button onClick={() => onPageChange(1)}        disabled={page === 1}          style={navBtn(page === 1)}         ><ChevronsLeft  size={16} /></button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}          style={navBtn(page === 1)}         ><ChevronLeft   size={16} /></button>
        {getPages()[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} style={pageBtn(false)}>1</button>
            {getPages()[0] > 2 && <span style={{ padding: '0 0.25rem', color: C.muted }}>…</span>}
          </>
        )}
        {getPages().map(p => (
          <button key={p} onClick={() => onPageChange(p)} style={pageBtn(p === page)}>{p}</button>
        ))}
        {getPages().at(-1) < totalPages && (
          <>
            {getPages().at(-1) < totalPages - 1 && <span style={{ padding: '0 0.25rem', color: C.muted }}>…</span>}
            <button onClick={() => onPageChange(totalPages)} style={pageBtn(false)}>{totalPages}</button>
          </>
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} style={navBtn(page === totalPages)}><ChevronRight  size={16} /></button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} style={navBtn(page === totalPages)}><ChevronsRight size={16} /></button>
      </div>
    </div>
  );
}

// ── Contenido principal ───────────────────────────────────────────────────
function ProductosContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [productos,           setProductos]           = useState([]);
  const [categorias,          setCategorias]          = useState([]);
  const [pagination,          setPagination]          = useState(null);
  const [loading,             setLoading]             = useState(true);
  const [mostrarFiltros,      setMostrarFiltros]      = useState(false);
  const [catalogoMin,         setCatalogoMin]         = useState(0);
  const [catalogoMax,         setCatalogoMax]         = useState(500000);
  const [busquedaInput,       setBusquedaInput]       = useState(searchParams.get('busqueda') || '');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(searchParams.get('categoria') || '');
  const [ordenar,             setOrdenar]             = useState('');
  const [page,                setPage]                = useState(1);
  const [precioMin,           setPrecioMin]           = useState(0);
  const [precioMax,           setPrecioMax]           = useState(500000);

  const busqueda     = useDebounce(busquedaInput, 400);
  const { addToCart } = useCart();
  const topRef       = useRef(null);

  useEffect(() => {
    fetch('/api/categorias')
      .then(r => r.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page',     String(page));
      params.set('pageSize', String(PAGE_SIZE));
      if (busqueda)              params.set('busqueda',  busqueda);
      if (categoriaSeleccionada) params.set('categoria', categoriaSeleccionada);
      if (ordenar)               params.set('ordenar',   ordenar);
      if (precioMin > catalogoMin || precioMax < catalogoMax) {
        params.set('precioMin', String(precioMin));
        params.set('precioMax', String(precioMax));
      }
      const res  = await fetch(`/api/productos?${params}`);
      const data = await res.json();
      if (data.productos) {
        setProductos(data.productos);
        setPagination(data.meta);
      } else {
        setProductos(Array.isArray(data) ? data : []);
        setPagination(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, busqueda, categoriaSeleccionada, ordenar, precioMin, precioMax, catalogoMin, catalogoMax]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);
  useEffect(() => { setPage(1); }, [busqueda, categoriaSeleccionada, ordenar, precioMin, precioMax]);

  const handlePageChange = (n) => {
    setPage(n);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const limpiarFiltros = () => {
    setBusquedaInput(''); setCategoriaSeleccionada(''); setOrdenar('');
    setPrecioMin(catalogoMin); setPrecioMax(catalogoMax); setPage(1);
    router.push('/productos');
  };

  const precioFiltrado    = precioMin > catalogoMin || precioMax < catalogoMax;
  const hayFiltrosActivos = busquedaInput || categoriaSeleccionada || ordenar || precioFiltrado;

  // ── Sidebar Filters ───────────────────────────────────────────────────
  const SidebarFilters = () => (
    <div>
      {/* Categoría */}
      <div style={{ borderBottom: `1px solid ${C.arenaBorder}`, paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.arenaText, marginBottom: '1rem' }}>
          Categoría
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="radio" name="cat" checked={!categoriaSeleccionada} onChange={() => setCategoriaSeleccionada('')} style={{ accentColor: C.terracota }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: !categoriaSeleccionada ? C.carbon : C.muted, fontWeight: !categoriaSeleccionada ? 600 : 400 }}>
              Todas
            </span>
          </label>
          {categorias.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="radio" name="cat"
                checked={categoriaSeleccionada === cat.id.toString()}
                onChange={() => setCategoriaSeleccionada(cat.id.toString())}
                style={{ accentColor: C.terracota }}
              />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: categoriaSeleccionada === cat.id.toString() ? C.carbon : C.muted, fontWeight: categoriaSeleccionada === cat.id.toString() ? 600 : 400 }}>
                {cat.nombre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ordenar */}
      <div>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.arenaText, marginBottom: '0.75rem' }}>
          Ordenar
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { value: '',            label: 'Recomendados' },
            { value: 'precio-asc',  label: 'Menor Precio' },
            { value: 'precio-desc', label: 'Mayor Precio' },
            { value: 'recientes',   label: 'Nuevos' },
          ].map(op => (
            <button key={op.value} onClick={() => setOrdenar(op.value)} style={{
              padding: '0.3rem 0.85rem',
              border: `1px solid ${ordenar === op.value ? C.terracota : C.arenaBorder}`,
              background: ordenar === op.value ? C.terracota : 'transparent',
              color: ordenar === op.value ? C.crema : C.muted,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{op.label}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: C.crema, minHeight: '100vh' }}>

      {/* ── Header catálogo ── */}
      <div style={{ background: C.arena, borderBottom: `1px solid ${C.arenaBorder}`, padding: '100px 24px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: 'Inter, sans-serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            <a href="/" style={{ color: C.muted, textDecoration: 'none' }}>Inicio</a>
            <span style={{ color: C.arenaBorder }}>›</span>
            <span style={{ color: C.arenaText }}>Colección</span>
          </div>
          {/* Ornamento */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{ width: 32, height: 1, background: C.arenaText }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontStyle: 'italic', color: C.arenaText }}>colección completa</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 5vw, 48px)', color: C.carbon, margin: 0, lineHeight: 1.1 }}>
            Nuestras <em style={{ color: C.terracota, fontStyle: 'italic' }}>Piezas</em>
          </h1>
          {!loading && pagination && (
            <p style={{ marginTop: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, color: C.muted }}>
              {pagination.total} {pagination.total === 1 ? 'pieza disponible' : 'piezas disponibles'}
            </p>
          )}
        </div>
      </div>

      {/* ── Barra de búsqueda ── */}
      <div style={{ background: C.arena, borderBottom: `1px solid ${C.arenaBorder}`, padding: '16px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 10, background: C.crema, border: `1px solid ${C.arenaBorder}`, padding: '0 16px', height: 44 }}>
            <Search size={16} color={C.arenaText} />
            <input
              type="text"
              placeholder="Buscar piezas..."
              value={busquedaInput}
              onChange={e => setBusquedaInput(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Inter, sans-serif', fontSize: 14, color: C.carbon }}
            />
            {busquedaInput && (
              <button onClick={() => setBusquedaInput('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort select */}
          <select
            value={ordenar}
            onChange={e => setOrdenar(e.target.value)}
            style={{ padding: '0 16px', height: 44, border: `1px solid ${C.arenaBorder}`, background: C.crema, fontFamily: 'Inter, sans-serif', fontSize: 13, color: C.carbon, cursor: 'pointer', outline: 'none', minWidth: 180 }}
          >
            <option value="">Recomendados</option>
            <option value="precio-asc">Menor Precio</option>
            <option value="precio-desc">Mayor Precio</option>
            <option value="recientes">Más nuevos</option>
          </select>

          {/* Mobile filtros btn */}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', height: 44, background: mostrarFiltros ? C.carbon : C.terracota, color: C.crema, border: 'none', fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}
            className="lg:hidden"
          >
            <SlidersHorizontal size={14} />
            Filtros
            {(categoriaSeleccionada || ordenar) && (
              <span style={{ background: C.crema, color: C.terracota, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                {(categoriaSeleccionada ? 1 : 0) + (ordenar ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile filtros panel */}
      {mostrarFiltros && (
        <div style={{ background: C.crema, border: `1px solid ${C.arenaBorder}`, margin: '0 24px', padding: 24 }} className="lg:hidden">
          <SidebarFilters />
          {hayFiltrosActivos && (
            <button onClick={limpiarFiltros} style={{ marginTop: 16, width: '100%', padding: '12px', background: C.arena, border: `1px solid ${C.arenaBorder}`, fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.carbon, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <X size={14} /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── Tags filtros activos ── */}
      {(busqueda || categoriaSeleccionada) && (
        <div style={{ maxWidth: 1280, margin: '16px auto', padding: '0 24px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Filtros:</span>
          {busqueda && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,88,58,0.1)', color: C.terracota, padding: '4px 12px', fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
              "{busqueda}"
              <button onClick={() => setBusquedaInput('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: C.terracota }}><X size={11} /></button>
            </span>
          )}
          {categoriaSeleccionada && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,88,58,0.1)', color: C.terracota, padding: '4px 12px', fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
              {categorias.find(c => c.id === parseInt(categoriaSeleccionada))?.nombre || 'Categoría'}
              <button onClick={() => setCategoriaSeleccionada('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: C.terracota }}><X size={11} /></button>
            </span>
          )}
          <button onClick={limpiarFiltros} style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Limpiar todo
          </button>
        </div>
      )}

      {/* ── Body: sidebar + grid ── */}
      <div ref={topRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>

        {/* Sidebar desktop */}
        <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 96 }} className="hidden lg:block">
          <div style={{ background: C.arena, border: `1px solid ${C.arenaBorder}`, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: C.carbon, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={16} color={C.arenaText} /> Filtrar
              </h2>
              {hayFiltrosActivos && (
                <button onClick={limpiarFiltros} style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: C.terracota, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  Limpiar
                </button>
              )}
            </div>
            <SidebarFilters />
          </div>
        </aside>

        {/* Grid */}
        <main style={{ flex: 1 }}>
          {!loading && pagination && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: C.muted, marginBottom: 24 }}>
              {pagination.total === 0 ? 'No se encontraron piezas' : (
                <><strong style={{ color: C.carbon }}>{pagination.total}</strong> {pagination.total === 1 ? 'pieza' : 'piezas'} encontradas</>
              )}
            </p>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <div key={i} style={{ aspectRatio: '4/5', background: `linear-gradient(90deg, ${C.arena} 25%, ${C.arenaBorder} 50%, ${C.arena} 75%)`, backgroundSize: '400px 100%', animation: 'tdShimmer 1.4s ease-in-out infinite' }} />
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', border: `1px solid ${C.arenaBorder}` }}>
              <ShoppingBag size={48} color={C.arenaBorder} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: C.muted, fontStyle: 'italic', marginBottom: 24 }}>
                No se encontraron piezas
              </p>
              <button onClick={limpiarFiltros} style={{ background: C.terracota, color: C.crema, border: 'none', padding: '12px 32px', fontFamily: 'Inter, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}>
                Ver todo
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                {productos.map(producto => (
                  <ProductCard key={producto.id} producto={producto} onAddToCart={addToCart} />
                ))}
              </div>
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </>
          )}
        </main>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes tdShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @media (max-width: 1023px) { .hidden.lg\\:block { display: none !important; } }
        @media (min-width: 1024px) { .lg\\:hidden { display: none !important; } }
      `}</style>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#faf9f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '2px solid #e8e0d4', borderTopColor: '#d4583a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic', color: '#b8945a' }}>Cargando colección…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ProductosContent />
    </Suspense>
  );
}