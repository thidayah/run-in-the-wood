import React from 'react'
import Header from "./Header"
import Footer from "./Footer"

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return (
    <main className="min-h-screen">
      <Header />
      {children}
      <Footer />
    </main>
  )
}
