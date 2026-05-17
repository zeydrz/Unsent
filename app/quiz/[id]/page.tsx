'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, X, Users } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import { Quiz, Question, Answer } from '@/types/quiz'

export default function TakeQuizPage() {
  const params = useParams<{ id: string }>()
  const quizId = params.id
  const { t } = useLanguage()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quiz flow state
  const [step, setStep] = useState<'name' | 'quiz' | 'results'>('name')
  const [participantName, setParticipantName] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single()

        if (error) throw error
        if (!data) throw new Error('Quiz not found')

        setQuiz(data as Quiz)
      } catch (err: any) {
        console.error(err)
        setError(err.message || t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId, t])

  const currentQuestion = quiz?.questions[currentIndex]
  const progress = quiz ? Math.round(((currentIndex) / quiz.questions.length) * 100) : 0

  const handleSelectOption = (index: number) => {
    setSelectedIndex(index)
  }

  const handleNext = () => {
    if (selectedIndex === null || !currentQuestion) return

    const isCorrect = selectedIndex === currentQuestion.correctIndex
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedIndex,
      isCorrect
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    if (currentIndex < (quiz!.questions.length - 1)) {
      // Move to next question with animation
      setCurrentIndex(currentIndex + 1)
      setSelectedIndex(null)
    } else {
      // Last question - submit
      submitQuiz(newAnswers)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      // Restore previous selection if exists
      const prevAnswer = answers[currentIndex - 1]
      setSelectedIndex(prevAnswer ? prevAnswer.selectedIndex : null)
      // Remove last answer temporarily? For simplicity, allow re-answer but we keep previous in final
      setAnswers(answers.slice(0, currentIndex - 1))
    }
  }

  const submitQuiz = async (finalAnswers: Answer[]) => {
    if (!quiz) return

    setSubmitting(true)

    const correctCount = finalAnswers.filter(a => a.isCorrect).length
    const score = Math.round((correctCount / quiz.questions.length) * 100)

    setFinalScore(score)

    try {
      const supabase = createClient()

      const attemptData = {
        quiz_id: quizId,
        participant_name: participantName.trim() || null,
        score,
        answers: finalAnswers
      }

      const { error } = await supabase
        .from('quiz_attempts')
        .insert(attemptData)

      if (error) throw error

      setStep('results')
      toast.success(t('quiz.thankYou'))
    } catch (err: any) {
      console.error('Submit error:', err)
      toast.error('Failed to save your attempt. Please try again.')
      // Still show results even if save fails
      setStep('results')
    } finally {
      setSubmitting(false)
    }
  }

  const restartQuiz = () => {
    setStep('name')
    setCurrentIndex(0)
    setSelectedIndex(null)
    setAnswers([])
    setFinalScore(0)
    setParticipantName('')
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
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-semibold mb-3">{t('notFound.title')}</h1>
          <p className="text-zinc-400 mb-8">{error || t('notFound.description')}</p>
          <Link href="/" className="btn btn-primary">{t('notFound.goHome')}</Link>
        </div>
      </div>
    )
  }

  // NAME INPUT STEP
  if (step === 'name') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8">
            <ArrowLeft size={16} /> Back
          </Link>

          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">{quiz.title}</h1>
              {quiz.description && <p className="text-zinc-400">{quiz.description}</p>}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400 block mb-2">{t('quiz.enterName')}</label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder={t('quiz.namePlaceholder')}
                  className="input"
                  maxLength={40}
                />
              </div>

              <button 
                onClick={() => setStep('quiz')}
                className="btn btn-primary w-full py-4 text-lg mt-2"
              >
                {t('quiz.startQuiz')}
              </button>
              
              <p className="text-center text-xs text-zinc-500">Your name is optional and only visible to the quiz creator.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // RESULTS STEP
  if (step === 'results') {
    const correctCount = answers.filter(a => a.isCorrect).length

    return (
      <div className="min-h-screen bg-zinc-950 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-emerald-400 text-sm tracking-widest mb-2">QUIZ COMPLETE</div>
            <h1 className="text-5xl font-semibold tracking-tighter mb-2">{t('quiz.score')}</h1>
            <div className="text-7xl font-mono font-semibold tabular-nums tracking-tighter text-white mb-1">{finalScore}<span className="text-4xl text-zinc-500">%</span></div>
            <p className="text-xl text-zinc-400">{t('quiz.correctCount', { correct: correctCount, total: quiz.questions.length })}</p>
          </div>

          {/* Breakdown */}
          <div className="card p-8 mb-8">
            <h3 className="font-semibold mb-6 flex items-center gap-2">{t('quiz.breakdown')}</h3>
            
            <div className="space-y-6">
              {quiz.questions.map((q, idx) => {
                const answer = answers[idx]
                const isCorrect = answer?.isCorrect
                return (
                  <div key={q.id} className="border-l-2 pl-4 border-white/10">
                    <div className="font-medium mb-3 text-lg">{q.text}</div>
                    
                    <div className="space-y-2 text-sm">
                      {q.options.map((opt, optIdx) => {
                        const isUserChoice = answer && answer.selectedIndex === optIdx
                        const isCorrectOpt = optIdx === q.correctIndex
                        
                        return (
                          <div 
                            key={optIdx}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${
                              isCorrectOpt ? 'correct border-green-500/40' : 
                              isUserChoice && !isCorrect ? 'incorrect border-red-500/40' : 'border-white/10'
                            }`}
                          >
                            <div className="font-mono text-xs w-5 text-center text-zinc-500">{String.fromCharCode(65 + optIdx)}</div>
                            <div className="flex-1">{opt}</div>
                            
                            {isUserChoice && (
                              <div className={`text-xs px-2.5 py-0.5 rounded ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {isCorrect ? t('quiz.yourAnswer') : t('quiz.yourAnswer')}
                              </div>
                            )}
                            {isCorrectOpt && !isUserChoice && (
                              <div className="text-xs px-2.5 py-0.5 rounded bg-green-500/20 text-green-400">{t('quiz.correctAnswer')}</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={restartQuiz} className="btn btn-secondary flex-1 py-3.5">
              {t('quiz.retakeQuiz')}
            </button>
            <Link href={`/results/${quizId}`} className="btn btn-primary flex-1 py-3.5 text-center">
              {t('quiz.viewResults')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // QUIZ TAKING STEP
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={16} /> {t('common.appName')}
          </Link>
          
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <div>{quiz.title}</div>
            <div className="w-px h-3 bg-white/20" />
            <div>{t('quiz.progress', { current: currentIndex + 1, total: quiz.questions.length })}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-2xl w-full">
          {/* Progress */}
          <div className="mb-8">
            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <div>QUESTION {currentIndex + 1}</div>
              <div>{quiz.questions.length} TOTAL</div>
            </div>
          </div>

          {/* Question with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="question-container"
            >
              <h2 className="text-3xl font-semibold tracking-tight mb-8 leading-tight">
                {currentQuestion?.text}
              </h2>

              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`option-btn text-left ${selectedIndex === index ? 'selected' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-xs w-6 h-6 flex items-center justify-center rounded-full border border-white/20 flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button 
              onClick={handleBack} 
              disabled={currentIndex === 0}
              className="btn btn-ghost disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowLeft size={16} /> {t('common.back')}
            </button>

            <button 
              onClick={handleNext}
              disabled={selectedIndex === null || submitting}
              className="btn btn-primary disabled:opacity-50 flex items-center gap-2 px-8"
            >
              {currentIndex === quiz.questions.length - 1 ? (
                submitting ? 'Submitting...' : t('common.submit')
              ) : (
                <>
                  {t('common.next')} <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
