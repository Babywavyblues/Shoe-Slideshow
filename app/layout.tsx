import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shoe Slideshow',
  description: 'Instruksi visual proses oven sepatu'
};

export const viewport: Viewport = { themeColor: '#0b0e14' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
