import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = { title: 'RadiNate Frontend', description: 'RadiNate dashboard with auth and RBAC' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
