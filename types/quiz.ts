export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

export interface Quiz {
  id: string
  title: string
  description: string | null
  questions: Question[]
  created_at?: string
}

export interface Answer {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
}

export interface QuizAttempt {
  id?: string
  quiz_id: string
  participant_name: string | null
  score: number
  answers: Answer[]
  created_at?: string
}

export type Language = 'en' | 'az' | 'ru'

export type Theme = 'light' | 'dark'
