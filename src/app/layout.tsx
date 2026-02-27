import type { Metadata } from 'next'
//@ts-ignore
import './globals.css'

export const metadata: Metadata = {
  title: 'Run in the Wood - Run wild, Find Freedom',
  description: 'Challenge yourself in the wilderness. Join our trail running events in the heart of nature.',
  keywords: ['trail running', 'adventure', 'nature', 'running', 'outdoor', 'community running', 'running event', 'fun run'],
   alternates: {
    canonical: "https://www.run-in-the-wood.vercel.app/",
  },
  openGraph: {
    title: 'Run in the Wood - Run wild, Find Freedom',
    description: 'Challenge yourself in the wilderness. Join our trail running events in the heart of nature.',
    url: "https://www.run-in-the-wood.vercel.app/",
    siteName: "Run in the Wood",
    images: [
      {
        url: "/images/ritw.jpeg",
        width: 900,
        height: 600,
        alt: "Run in the Wood Running Event 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/ritw.jpeg"],
  },
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