import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | ryong.log',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function RyongLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}

