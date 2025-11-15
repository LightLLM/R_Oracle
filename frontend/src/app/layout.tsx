import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'R-Oracle: Resilient Multi-Source Oracle Chain',
  description: 'A resilient multi-source oracle chain built on Polkadot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

