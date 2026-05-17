'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-semibold tracking-tighter text-white/10 leading-none mb-2">404</div>
        <h1 className="text-4xl font-semibold tracking-tight mb-3">{t('notFound.title')}</h1>
        <p className="text-lg text-zinc-400 mb-8">{t('notFound.description')}</p>
        
        <Link 
          href="/" 
          className="btn btn-primary px-8 py-3 inline-flex"
        >
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  )
}
