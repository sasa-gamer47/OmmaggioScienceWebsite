import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Sidebar from '@/components/shared/Sidebar'
import { Toaster } from "@/components/ui/toaster"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  
  // const { sessionClaims } = auth();

  // const userId = sessionClaims?.sub as string;



  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </head>
        <body>
          <Sidebar />
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}