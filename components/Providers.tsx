'use client'

import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          className="sonner-toaster"
        />
      </LanguageProvider>
    </ThemeProvider>
  )
}
