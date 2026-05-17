'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Copy, Users, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import { Quiz, QuizAttempt, Answer } from '@/types/quiz'

interface AttemptWithDetails extends QuizAttempt {
  expanded?: boolean
}

export default function ResultsPage() {
  const params = useParams<{ id: string }>()
  const quizId = params.id
  const { t } = useLanguage()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempts, setAttempts] = useState<AttemptWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!quizId) return

      try {
        const supabase = createClient()

        // Fetch quiz
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single()

        if (quizError) throw quizError
        if (!quizData) throw new Error('Quiz not found')

        setQuiz(quizData as Quiz)

        // Fetch attempts, newest first
        const { data: attemptsData, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('quiz_id', quizId)
          .order('created_at', { ascending: false })

        if (attemptsError) throw attemptsError

        setAttempts((attemptsData || []) as AttemptWithDetails[])
      } catch (err: any) {
        console.error(err)
        setError(err.message || t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [quizId, t])

  const toggleExpand = (index: number) => {
    setAttempts(prev => 
      prev.map((att, i) => 
        i === index ? { ...att, expanded: !att.expanded } : att
      )
    )
  }

  const totalAttempts = attempts.length
  const averageScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts) 
    : 0

  const copyTakeLink = async () => {
    const url = `${window.location.origin}/quiz/${quizId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success(t('common.copied'))
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Intl.DateTimeFormat('en', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    }).format(new Date(dateString))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-3">{t('notFound.title')}</h1>
          <p className="text-zinc-400 mb-8">{error || t('notFound.description')}</p>
          <Link href="/" className="btn btn-primary">{t('notFound.goHome')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-3">
              <ArrowLeft size={16} /> Home
            </Link>
            <h1 className="text-4xl font-semibold tracking-tighter">{t('results.title')}</h1>
            <p className="text-2xl text-white/90 mt-1 tracking-tight">{quiz.title}</p>
          </div>

          <button 
            onClick={copyTakeLink}
            className="btn btn-secondary flex items-center gap-2 text-sm"
          >
            {copied ? 'Copied!' : t('results.shareTakeLink')} <Copy size={15} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="card p-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-1">
              <Users size={18} />
              <span className="text-xs tracking-widest">ATTEMPTS</span>
            </div>
            <div className="text-5xl font-semibold tabular-nums tracking-tighter">{totalAttempts}</div>
            <div className="text-sm text-zinc-500 mt-1">{t('results.totalAttempts')}</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 text-amber-400 mb-1">
              <TrendingUp size={18} />
              <span className="text-xs tracking-widest">AVERAGE</span>
            </div>
            <div className="text-5xl font-semibold tabular-nums tracking-tighter">{averageScore}<span className="text-3xl text-zinc-400">%</span></div>
            <div className="text-sm text-zinc-500 mt-1">{t('results.averageScore')}</div>
          </div>

          <div className="card p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs tracking-widest text-zinc-500 mb-1">SHARE</div>
              <div className="font-medium">Invite more people to take the quiz</div>
            </div>
            <Link href={`/quiz/${quizId}`} className="text-sm text-white/70 hover:text-white flex items-center gap-1 mt-4">
              Open Take Quiz link →
            </Link>
          </div>
        </div>

        {/* Attempts List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-xl flex items-center gap-2">
            {t('results.attempts')} 
            <span className="text-xs text-zinc-500 font-normal">({t('results.newestFirst')})</span>
          </h2>
        </div>

        {attempts.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-zinc-400 mb-4">{t('results.noAttempts')}</p>
            <Link href={`/quiz/${quizId}`} className="btn btn-primary inline-flex">Share Take Quiz Link</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt, index) => {
              const isExpanded = attempt.expanded
              const participant = attempt.participant_name || t('common.anonymous')
              const correctCount = attempt.answers?.filter((a: Answer) => a.isCorrect).length || 0
              const totalQ = quiz.questions.length

              return (
                <div key={attempt.id || index} className="card overflow-hidden">
                  <button 
                    onClick={() => toggleExpand(index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium text-lg">{participant}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar size={12} /> {formatDate(attempt.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono text-2xl tabular-nums tracking-tighter">{attempt.score}<span className="text-base text-zinc-400">%</span></div>
                        <div className="text-[10px] text-zinc-500 -mt-1">SCORE</div>
                      </div>
                      <div className="text-zinc-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 px-6 pb-6 pt-2"
                      >
                        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4 pt-2">{t('results.yourAnswers')}</div>
                        
                        <div className="space-y-5 text-sm">
                          {quiz.questions.map((q, qIdx) => {
                            const ans = attempt.answers?.[qIdx] as Answer | undefined
                            if (!ans) return null
                            
                            return (
                              <div key={qIdx} className="pl-1">
                                <div className="font-medium mb-2.5">{q.text}</div>
                                <div className="pl-4 space-y-1.5 text-xs">
                                  {q.options.map((opt, oIdx) => {
                                    const selected = ans.selectedIndex === oIdx
                                    const correct = oIdx === q.correctIndex
                                    return (
                                      <div key={oIdx} className={`flex gap-2 items-center ${correct ? 'text-emerald-400' : selected ? 'text-red-400' : 'text-zinc-400'}`}>
                                        <span className="font-mono w-4">{String.fromCharCode(65 + oIdx)}.</span>
                                        <span>{opt}</span>
                                        {selected && <span className="ml-auto text-[10px] px-1.5 py-px rounded bg-white/10">YOUR CHOICE</span>}
                                        {correct && <span className="ml-auto text-[10px] px-1.5 py-px rounded bg-emerald-500/20 text-emerald-400">CORRECT</span>}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-zinc-500">
                          {correctCount} / {totalQ} correct • {attempt.score}% score
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
