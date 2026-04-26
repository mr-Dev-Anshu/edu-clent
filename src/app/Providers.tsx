"use client"

import ReactQueryProvider from "@/providers/ReactQueryProvider"
import ReduxProvider from "@/providers/ReduxProviders"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ReduxProvider>
  )
}