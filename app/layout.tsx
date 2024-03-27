import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Sidebar from '@/components/shared/Sidebar'
import { Toaster } from "@/components/ui/toaster"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { sessionClaims } = auth();

  // const userId = sessionClaims?.sub as string;

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nova+Square&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&family=Nova+Square&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&family=Nova+Square&family=Sono:wght,MONO@200..800,0&display=swap"
            rel="stylesheet"
          ></link>
        </head>
        <body>
          <Sidebar />
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
