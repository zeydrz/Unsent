'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Link as LinkIcon, BarChart3, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Toaster } from 'sonner' // already in providers

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: 'en' as const, label: 'EN', flag: '🇬🇧' },
    { code: 'az' as const, label: 'AZ', flag: '🇦🇿' },
    { code: 'ru' as const, label: 'RU', flag: '🇷🇺' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-zinc-950 font-semibold text-lg tracking-tighter">U</span>
            </div>
            <div>
              <div className="font-semibold tracking-tighter text-xl">{t('common.appName')}</div>
              <div className="text-[10px] text-zinc-500 -mt-1">ANONYMOUS QUIZZES</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-zinc-900 rounded-full p-1 border border-white/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-all flex items-center gap-1.5 ${
                    language === lang.code 
                      ? 'bg-white text-zinc-950 font-medium' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors border border-white/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link 
              href="/create" 
              className="btn btn-primary text-sm px-5 py-2 ml-2 hidden sm:flex"
            >
              {t('common.createQuiz')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-[2px] mb-6">
          100% ANONYMOUS • NO ACCOUNTS • NO TRACKING
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-semibold tracking-tighter leading-none mb-6">
          {t('home.heroTitle')}
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-zinc-400 mb-10">
          {t('home.heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/create" 
            className="btn btn-primary text-base px-8 py-4 group"
          >
            {t('home.startCreating')}
            <ArrowRight className="group-hover:translate-x-0.5 transition-transform" size={18} />
          </Link>
          <a 
            href="#how-it-works" 
            className="btn btn-secondary text-base px-8 py-4"
          >
            {t('home.howItWorks')}
          </a>
        </div>

        <div className="mt-16 text-xs text-zinc-500 flex items-center justify-center gap-2">
          <div className="w-px h-3 bg-white/20" /> Built for real connections • Shareable links only <div className="w-px h-3 bg-white/20" />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-white/10 bg-zinc-900/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[3px] text-zinc-500 mb-3">SIMPLE &amp; PRIVATE</div>
            <h2 className="text-4xl font-semibold tracking-tighter">{t('home.howItWorks')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Users className="w-6 h-6" />, 
                title: t('home.step1'), 
                desc: t('home.step1Desc') 
              },
              { 
                icon: <LinkIcon className="w-6 h-6" />, 
                title: t('home.step2'), 
                desc: t('home.step2Desc') 
              },
              { 
                icon: <BarChart3 className="w-6 h-6" />, 
                title: t('home.step3'), 
                desc: t('home.step3Desc') 
              },
            ].map((step, index) => (
              <div key={index} className="card p-8 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:bg-white/10 transition-colors">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-2xl tracking-tight mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates teaser */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="text-xs tracking-[3px] text-zinc-500 mb-2">GET STARTED FAST</div>
            <h2 className="text-4xl font-semibold tracking-tighter">{t('home.templatesTitle')}</h2>
          </div>
          <Link href="/create" className="text-sm flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            Browse all templates in creator <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: t('create.bestFriend'), emoji: '👯', desc: 'Perfect for your closest friends' },
            { name: t('create.boyfriendGirlfriend'), emoji: '💕', desc: 'Deep questions for couples' },
            { name: t('create.siblings'), emoji: '👨‍👩‍👧‍👦', desc: 'Family memories & inside jokes' },
          ].map((tpl, i) => (
            <Link 
              key={i} 
              href="/create" 
              className="card p-6 hover:border-white/30 group block"
            >
              <div className="text-4xl mb-4">{tpl.emoji}</div>
              <div className="font-semibold text-xl tracking-tight mb-1 group-hover:underline">{tpl.name}</div>
              <p className="text-sm text-zinc-400">{tpl.desc}</p>
              <div className="mt-4 text-xs text-zinc-500 flex items-center gap-1">
                Use template <ArrowRight size={12} className="group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer / Trust */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500">
          <p className="mb-2">
            UnsentAz is 100% anonymous. We don&apos;t store personal data. 
            Only you control who sees the results via the private link.
          </p>
          <p className="text-xs">Made for meaningful conversations • Open source friendly</p>
        </div>
      </footer>
    </div>
  )
}
