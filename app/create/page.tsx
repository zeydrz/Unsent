'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ArrowLeft, Copy, Check, Users, Heart, Users2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import { Question } from '@/types/quiz'

interface QuestionForm {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

const TEMPLATES = {
  bestFriend: {
    title: "How well do you know me? — Best Friend Edition",
    description: "Let's see how well you know your bestie!",
    questions: [
      { text: "What is my favorite color?", options: ["Blue", "Black", "Green", "Purple"], correctIndex: 1 },
      { text: "Where did we first meet?", options: ["School", "A party", "Online", "Through friends"], correctIndex: 0 },
      { text: "What is my go-to comfort food?", options: ["Pizza", "Ice cream", "Burgers", "Sushi"], correctIndex: 0 },
      { text: "Which movie can I watch on repeat?", options: ["The Matrix", "La La Land", "Inception", "Everything Everywhere"], correctIndex: 2 },
      { text: "What is my biggest pet peeve?", options: ["Being late", "Loud chewing", "Slow walkers", "Bad grammar"], correctIndex: 1 },
    ]
  },
  boyfriendGirlfriend: {
    title: "How well do you know me? — Couple Edition",
    description: "Test how deep your connection really is.",
    questions: [
      { text: "What is my love language?", options: ["Words of affirmation", "Quality time", "Physical touch", "Acts of service"], correctIndex: 2 },
      { text: "What was our first date like?", options: ["Coffee shop", "Long walk", "Dinner & movie", "Spontaneous adventure"], correctIndex: 1 },
      { text: "What makes me happiest?", options: ["Traveling together", "Quiet nights in", "Trying new restaurants", "Deep conversations"], correctIndex: 0 },
      { text: "Which song reminds you of us?", options: ["Perfect - Ed Sheeran", "All of Me - John Legend", "Something personal", "Can't Help Falling in Love"], correctIndex: 2 },
      { text: "What is one thing I want to do together this year?", options: ["Travel to a new country", "Move in together", "Adopt a pet", "Start a shared hobby"], correctIndex: 0 },
    ]
  },
  siblings: {
    title: "How well do you know me? — Siblings Edition",
    description: "Family knows best... or do they?",
    questions: [
      { text: "What was my favorite childhood toy?", options: ["LEGO", "Barbie / Action figure", "Video games", "Books"], correctIndex: 0 },
      { text: "Which family tradition do I love most?", options: ["Holiday dinners", "Summer vacations", "Birthday rituals", "Sunday lunches"], correctIndex: 2 },
      { text: "What is my hidden talent?", options: ["Singing", "Drawing", "Cooking", "Making people laugh"], correctIndex: 3 },
      { text: "What always makes me laugh?", options: ["Dad jokes", "Memes", "Old videos of us", "Silly arguments"], correctIndex: 2 },
      { text: "If I could change one thing about our childhood, what would it be?", options: ["More time together", "Less fighting over remote", "More trips", "Different rules"], correctIndex: 0 },
    ]
  }
}

export default function CreateQuizPage() {
  const { t } = useLanguage()
  const [title, setTitle] = useState("How well do you know me?")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { id: crypto.randomUUID(), text: "", options: ["", "", "", ""], correctIndex: 0 }
  ])
  const [isCreating, setIsCreating] = useState(false)
  const [createdQuiz, setCreatedQuiz] = useState<{ id: string; title: string } | null>(null)
  const [copiedLink, setCopiedLink] = useState<'take' | 'results' | null>(null)

  const addQuestion = () => {
    if (questions.length >= 15) {
      toast.error(t('create.validation.maxQuestions'))
      return
    }
    setQuestions([
      ...questions,
      { id: crypto.randomUUID(), text: "", options: ["", "", "", ""], correctIndex: 0 }
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error(t('create.validation.minQuestions'))
      return
    }
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
  }

  const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions]
    const newOptions = [...newQuestions[qIndex].options]
    newOptions[optIndex] = value
    newQuestions[qIndex].options = newOptions
    setQuestions(newQuestions)
  }

  const loadTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey]
    
    if (questions.some(q => q.text.trim() !== '' || q.options.some(o => o.trim() !== ''))) {
      if (!confirm(t('create.loadTemplateConfirm'))) {
        return
      }
    }

    const templateQuestions: QuestionForm[] = template.questions.map((q) => ({
      id: crypto.randomUUID(),
      text: q.text,
      options: [...q.options],
      correctIndex: q.correctIndex
    }))

    setTitle(template.title)
    setDescription(template.description)
    setQuestions(templateQuestions)
    
    toast.success(`${templateKey === 'bestFriend' ? t('create.bestFriend') : templateKey === 'boyfriendGirlfriend' ? t('create.boyfriendGirlfriend') : t('create.siblings')} loaded`)
  }

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error(t('create.validation.titleRequired'))
      return false
    }
    if (questions.length === 0) {
      toast.error(t('create.validation.minQuestions'))
      return false
    }
    if (questions.length > 15) {
      toast.error(t('create.validation.maxQuestions'))
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.text.trim()) {
        toast.error(`${t('create.validation.questionRequired')} (${i + 1})`)
        return false
      }
      const filledOptions = q.options.filter(o => o.trim() !== '')
      if (filledOptions.length !== 4) {
        toast.error(`${t('create.validation.optionsRequired')} (${i + 1})`)
        return false
      }
      const unique = new Set(q.options.map(o => o.trim().toLowerCase()))
      if (unique.size !== 4) {
        toast.error(`${t('create.validation.duplicateOptions')} (${i + 1})`)
        return false
      }
    }
    return true
  }

  // ==================== FIXED handleCreate ====================
  const handleCreate = async () => {
    if (!validateForm()) return

    // Early guard for missing Supabase credentials
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error(
        'Missing Supabase environment variables.\n\nPlease create .env.local and restart the dev server.'
      )
      return
    }

    setIsCreating(true)

    try {
      const supabase = createClient()

      const quizData = {
        title: title.trim(),
        description: description.trim() || null,
        questions: questions.map((q) => ({
          id: q.id,
          text: q.text.trim(),
          options: q.options.map(o => o.trim()),
          correctIndex: q.correctIndex
        }))
      }

      const { data, error } = await supabase
        .from('quizzes')
        .insert(quizData)
        .select('id, title')
        .single()

      if (error) throw error

      setCreatedQuiz({ id: data.id, title: data.title })
      toast.success('Quiz created successfully!')
      
    } catch (error: any) {
      console.error('Create error (full):', error)

      let errorMessage = t('common.error')

      if (error?.message) {
        errorMessage = error.message
      } else if (error?.error_description) {
        errorMessage = error.error_description
      } else if (error?.details) {
        errorMessage = error.details
      } else if (error?.code) {
        errorMessage = `Database error (code: ${error.code})`
      }

      const lowerMsg = errorMessage.toLowerCase()
      if (lowerMsg.includes('relation') || lowerMsg.includes('does not exist')) {
        errorMessage = 'Database tables not found. Please run the SQL from README.md.'
      }
      if (lowerMsg.includes('row-level security') || lowerMsg.includes('policy')) {
        errorMessage = 'Permission denied. Please apply RLS policies from the README.'
      }

      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }
  // ============================================================

  const copyToClipboard = async (text: string, type: 'take' | 'results') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLink(type)
      toast.success(t('common.copied'))
      setTimeout(() => setCopiedLink(null), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const resetForm = () => {
    setCreatedQuiz(null)
    setTitle("How well do you know me?")
    setDescription("")
    setQuestions([{ id: crypto.randomUUID(), text: "", options: ["", "", "", ""], correctIndex: 0 }])
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm hover:text-zinc-300 transition-colors">
            <ArrowLeft size={16} /> {t('common.appName')}
          </Link>
          <div className="text-xs text-zinc-500">CREATE QUIZ</div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {!createdQuiz ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-semibold tracking-tighter mb-3">{t('create.title')}</h1>
              <p className="text-xl text-zinc-400">Create your quiz in under 2 minutes. Share instantly.</p>
            </div>

            {/* Templates */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs tracking-widest text-zinc-500 mb-1">{t('create.templates')}</div>
                  <h3 className="font-medium text-lg">Quick Start Templates</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => loadTemplate('bestFriend')} className="card p-5 text-left hover:border-white/40 transition-all group flex gap-4 items-start">
                  <div className="mt-1"><Users className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <div className="font-medium">{t('create.bestFriend')}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">5 ready questions</div>
                  </div>
                </button>
                
                <button onClick={() => loadTemplate('boyfriendGirlfriend')} className="card p-5 text-left hover:border-white/40 transition-all group flex gap-4 items-start">
                  <div className="mt-1"><Heart className="w-5 h-5 text-pink-400" /></div>
                  <div>
                    <div className="font-medium">{t('create.boyfriendGirlfriend')}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">5 ready questions</div>
                  </div>
                </button>
                
                <button onClick={() => loadTemplate('siblings')} className="card p-5 text-left hover:border-white/40 transition-all group flex gap-4 items-start">
                  <div className="mt-1"><Users2 className="w-5 h-5 text-amber-400" /></div>
                  <div>
                    <div className="font-medium">{t('create.siblings')}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">5 ready questions</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-8">
              <div className="card p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-400">{t('create.quizTitle')}</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('create.quizTitlePlaceholder')} className="input text-2xl font-semibold tracking-tight" maxLength={80} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-400">{t('create.description')}</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('create.descriptionPlaceholder')} className="input textarea" rows={2} maxLength={200} />
                </div>
              </div>

              {/* Questions Section */}
              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="font-medium flex items-center gap-2">
                    {t('create.questions')} 
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-400">{questions.length}/15</span>
                  </div>
                  <button onClick={addQuestion} className="btn btn-secondary text-sm flex items-center gap-2 px-4 py-2" disabled={questions.length >= 15}>
                    <Plus size={16} /> {t('create.addQuestion')}
                  </button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {questions.map((question, index) => (
                      <motion.div key={question.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="font-mono text-xs text-zinc-500">QUESTION {index + 1}</div>
                          <button onClick={() => removeQuestion(index)} className="text-zinc-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
                        </div>

                        <input type="text" value={question.text} onChange={(e) => updateQuestion(index, 'text', e.target.value)} placeholder={`${t('create.questionLabel')} ${index + 1}`} className="input mb-5 text-lg" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0 flex items-center justify-center text-xs font-mono text-zinc-500">{String.fromCharCode(65 + optIndex)}</div>
                              <input type="text" value={option} onChange={(e) => updateOption(index, optIndex, e.target.value)} placeholder={`${t('create.optionLabel')} ${optIndex + 1}`} className="input flex-1" />
                            </div>
                          ))}
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 mb-2">{t('create.correctAnswer')}</div>
                          <div className="flex flex-wrap gap-2">
                            {question.options.map((_, optIndex) => (
                              <button key={optIndex} type="button" onClick={() => updateQuestion(index, 'correctIndex', optIndex)} className={`px-4 py-1.5 text-sm rounded-full border transition-all ${question.correctIndex === optIndex ? 'bg-white text-zinc-950 border-white' : 'border-white/20 hover:bg-white/5'}`}>
                                Option {String.fromCharCode(65 + optIndex)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={handleCreate} disabled={isCreating} className="btn btn-primary w-full py-4 text-lg disabled:opacity-70 flex items-center justify-center gap-3">
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('create.creating')}
                    </>
                  ) : (
                    t('create.createButton')
                  )}
                </button>
                <p className="text-center text-xs text-zinc-500 mt-3">Your quiz will be instantly shareable via link.</p>
              </div>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="max-w-lg mx-auto text-center py-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-4xl font-semibold tracking-tighter mb-3">{t('create.successTitle')}</h2>
            <p className="text-zinc-400 mb-8">"{createdQuiz.title}" is ready to share.</p>

            <div className="card p-8 text-left space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-emerald-400">{t('create.takeQuizLink')}</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 font-mono text-sm bg-zinc-900 p-3 rounded-xl border border-white/10 truncate">{baseUrl}/quiz/{createdQuiz.id}</div>
                  <button onClick={() => copyToClipboard(`${baseUrl}/quiz/${createdQuiz.id}`, 'take')} className="btn btn-secondary px-5">
                    {copiedLink === 'take' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-amber-400">{t('create.resultsLink')}</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 font-mono text-sm bg-zinc-900 p-3 rounded-xl border border-white/10 truncate">{baseUrl}/results/{createdQuiz.id}</div>
                  <button onClick={() => copyToClipboard(`${baseUrl}/results/${createdQuiz.id}`, 'results')} className="btn btn-secondary px-5">
                    {copiedLink === 'results' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href={`/quiz/${createdQuiz.id}`} className="btn btn-primary flex-1 py-3">Preview Take Quiz</Link>
              <button onClick={resetForm} className="btn btn-secondary flex-1 py-3">{t('create.createAnother')}</button>
            </div>

            <Link href="/" className="block mt-6 text-sm text-zinc-500 hover:text-white">← Back to home</Link>
          </div>
        )}
      </div>
    </div>
  )
}