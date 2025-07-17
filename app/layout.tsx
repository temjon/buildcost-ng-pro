import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BuildCost NG Pro - Nigerian Construction Cost Estimator',
  description: 'Get instant ±10% accurate construction cost estimates for any residential building in Nigeria using live 2025 market data and AI.',
  keywords: 'construction cost, Nigeria, building estimate, quantity surveyor, cost calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    BuildCost NG Pro
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/calculate" className="text-gray-700 hover:text-gray-900">
                    Calculate
                  </a>
                  <a href="/projects" className="text-gray-700 hover:text-gray-900">
                    Projects
                  </a>
                  <a href="/admin" className="text-gray-700 hover:text-gray-900">
                    Admin
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}