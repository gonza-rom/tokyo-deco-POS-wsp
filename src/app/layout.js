import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  themeColor: '#d4583a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Tokio Deco | Artesanías & Textiles · Catamarca',
  description: 'Piezas artesanales únicas hechas a mano en Catamarca, Argentina. Macramé, kraft, textiles y más. Cada objeto lleva la huella de quien lo creó.',
  keywords: 'artesanías, macramé, textiles, kraft, catamarca, argentina, hecho a mano, tokio deco',
  authors: [{ name: 'Tokio Deco' }],
  creator: 'Tokio Deco',
  publisher: 'Tokio Deco',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://www.tokiodeco.com.ar',
    title: 'Tokio Deco | Artesanías & Textiles',
    description: 'Piezas artesanales únicas hechas a mano en Catamarca.',
    siteName: 'Tokio Deco',
    images: [{ url: '/logo-bg.png', width: 1200, height: 630, alt: 'Tokio Deco' }],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo-bg.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
     <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <Cart />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}