import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
