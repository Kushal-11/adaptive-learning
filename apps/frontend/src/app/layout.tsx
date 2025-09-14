import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'AI Agent Marketplace',
  description: 'Autonomous negotiation platform where AI agents buy and sell items',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
