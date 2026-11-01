import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PUENTE — tu siguiente paso, con claridad',
  description: 'Una herramienta para pensar una transición de trabajo cuidando tus gastos esenciales.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className="antialiased">{children}</body></html>;
}
