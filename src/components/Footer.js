import Link from 'next/link'
import { Instagram, MessageCircle, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-carbon text-crema/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <p className="font-display text-3xl text-crema mb-4">
              Tokio <span className="text-terracota-400 italic">Deco</span>
            </p>
            <p className="font-sans text-sm leading-relaxed text-crema/60 max-w-xs">
              Piezas artesanales únicas hechas a mano en Catamarca, Argentina. Cada tejido cuenta una historia.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-crema/40 mb-6">Navegar</p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/productos',   label: 'Productos' },
                { href: '/#historia',   label: 'Nuestra Historia' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-crema/60 hover:text-terracota-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-crema/40 mb-6">Encontranos</p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="https://instagram.com/tokio_decoar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-crema/60 hover:text-terracota-400 transition-colors"
                >
                  <Instagram size={16} /> @tokio_decoar
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5493834327903"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-crema/60 hover:text-salvia-400 transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@tokiodeco.com.ar"
                  className="flex items-center gap-3 text-sm text-crema/60 hover:text-arena-400 transition-colors"
                >
                  <Mail size={16} /> hola@tokiodeco.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-crema/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-crema/30">
            © {new Date().getFullYear()} Tokio Deco. Todos los derechos reservados.
          </p>
          <p className="font-sans text-xs text-crema/30 flex items-center gap-1">
            Hecho con <Heart size={11} className="text-terracota-400 fill-current" /> en Catamarca, Argentina
          </p>
          <p className="font-sans">
              Desarrollado por{' '}
              <a href="https://www.devhub.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-jmr-green transition-colors font-sans">
                DevHub
              </a>
          </p>
        </div>
      </div>
    </footer>
  )
}