<<<<<<< HEAD
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers from "./Providers"

=======
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ReduxProvider from "@/providers/ReduxProviders";
import { Toaster } from "sonner";
>>>>>>> 9be43ca85a0b2ce1d0b4219a8009b8f081fa6b34
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "EDU",
  description: "Saas app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
<<<<<<< HEAD
        </Providers>
=======
          <Toaster
          position="top-center" 
          richColors 
          closeButton 
          expand={false}
        />
        </ReactQueryProvider>
        </ReduxProvider>
>>>>>>> 9be43ca85a0b2ce1d0b4219a8009b8f081fa6b34
      </body>
    </html>
  )
}