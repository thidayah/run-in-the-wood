import type { Metadata } from 'next'
//@ts-ignore
import './globals.css'

export const metadata: Metadata = {
  title: 'Run in the Wood - Trail Running Adventure',
  description: 'Challenge yourself in the wilderness. Join our trail running events in the heart of nature.',
  keywords: ['trail running', 'adventure', 'nature', 'running', 'outdoor'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <div className="forest-overlay">
          {children}
        </div>
      </body>
    </html>
  )
}