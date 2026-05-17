'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language } from '@/types/quiz'

interface Translations {
  [key: string]: string | Translations
}

const translations: Record<Language, Translations> = {
  en: {
    common: {
      appName: 'UnsentAz',
      tagline: 'Anonymous "How well do you know me?" quizzes',
      createQuiz: 'Create Quiz',
      takeQuiz: 'Take Quiz',
      viewResults: 'View Results',
      copy: 'Copy',
      copied: 'Copied to clipboard!',
      anonymous: 'Anonymous',
      loading: 'Loading...',
      error: 'Something went wrong',
      tryAgain: 'Try again',
      back: 'Back',
      next: 'Next',
      submit: 'Submit Quiz',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
    },
    home: {
      heroTitle: 'Create beautiful anonymous quizzes.',
      heroSubtitle: 'Share a link. Get honest answers. 100% private — no accounts, no tracking.',
      startCreating: 'Start Creating',
      howItWorks: 'How it works',
      step1: 'Create your quiz',
      step1Desc: 'Add up to 15 questions with 4 options each. Use templates or build from scratch.',
      step2: 'Share the link',
      step2Desc: 'Get two links: one for taking the quiz, one for viewing results.',
      step3: 'See the results',
      step3Desc: 'Watch attempts come in with names (optional) and detailed breakdowns.',
      templatesTitle: 'Quick Start Templates',
      templatesDesc: 'Load a template and customize it. Perfect for friends, partners, or family.',
    },
    create: {
      title: 'Create a New Quiz',
      quizTitle: 'Quiz Title',
      quizTitlePlaceholder: 'How well do you know me?',
      description: 'Description (optional)',
      descriptionPlaceholder: 'A fun quiz for my closest friends...',
      questions: 'Questions',
      addQuestion: 'Add Question',
      removeQuestion: 'Remove',
      questionLabel: 'Question',
      optionLabel: 'Option',
      correctAnswer: 'Correct Answer',
      selectCorrect: 'Select correct option',
      templates: 'Quick Templates',
      bestFriend: 'Best Friend Quiz',
      boyfriendGirlfriend: 'Boyfriend / Girlfriend Quiz',
      siblings: 'Siblings Quiz',
      loadTemplate: 'Load Template',
      loadTemplateConfirm: 'This will replace your current questions. Continue?',
      createButton: 'Create Quiz',
      creating: 'Creating...',
      successTitle: 'Quiz Created Successfully!',
      takeQuizLink: 'Take Quiz Link',
      resultsLink: 'View Results Link',
      copyLink: 'Copy Link',
      createAnother: 'Create Another Quiz',
      validation: {
        titleRequired: 'Please enter a quiz title',
        minQuestions: 'Please add at least 1 question',
        maxQuestions: 'Maximum 15 questions allowed',
        questionRequired: 'Question text is required',
        optionsRequired: 'All 4 options are required',
        duplicateOptions: 'Options must be unique',
      },
    },
    quiz: {
      enterName: 'Enter your name (optional)',
      namePlaceholder: 'Your name here...',
      startQuiz: 'Start Quiz',
      progress: 'Question {current} of {total}',
      yourAnswer: 'Your answer',
      correctAnswer: 'Correct answer',
      score: 'Your Score',
      correctCount: '{correct} out of {total} correct',
      breakdown: 'Detailed Breakdown',
      retakeQuiz: 'Retake Quiz',
      viewResults: 'View All Results',
      thankYou: 'Thank you for taking the quiz!',
    },
    results: {
      title: 'Quiz Results',
      totalAttempts: 'Total Attempts',
      averageScore: 'Average Score',
      attempts: 'Attempts',
      newestFirst: 'Newest first',
      participant: 'Participant',
      score: 'Score',
      date: 'Date',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      yourAnswers: 'Answers',
      noAttempts: 'No attempts yet. Share the Take Quiz link!',
      shareTakeLink: 'Share Take Quiz Link',
    },
    notFound: {
      title: 'Quiz Not Found',
      description: 'This quiz link may be invalid or has been removed.',
      goHome: 'Go to Homepage',
    },
  },
  az: {
    common: {
      appName: 'UnsentAz',
      tagline: 'Anonim "Məni nə qədər yaxşı tanıyırsan?" testləri',
      createQuiz: 'Test Yarat',
      takeQuiz: 'Testi Keç',
      viewResults: 'Nəticələrə Bax',
      copy: 'Kopyala',
      copied: 'Panoya kopyalandı!',
      anonymous: 'Anonim',
      loading: 'Yüklənir...',
      error: 'Xəta baş verdi',
      tryAgain: 'Yenidən cəhd et',
      back: 'Geri',
      next: 'Növbəti',
      submit: 'Testi Təqdim Et',
      cancel: 'Ləğv et',
      save: 'Saxla',
      edit: 'Redaktə et',
    },
    home: {
      heroTitle: 'Gözəl anonim testlər yaradın.',
      heroSubtitle: 'Link paylaşın. Dürüst cavablar alın. 100% gizli — hesab yoxdur, izləmə yoxdur.',
      startCreating: 'Yaratmağa Başla',
      howItWorks: 'Necə işləyir',
      step1: 'Testinizi yaradın',
      step1Desc: 'Hər biri 4 variantlı 15-ə qədər sual əlavə edin. Şablonlardan istifadə edin və ya sıfırdan qurun.',
      step2: 'Linki paylaşın',
      step2Desc: 'İki link əldə edin: biri testi keçmək üçün, digəri nəticələrə baxmaq üçün.',
      step3: 'Nəticələri görün',
      step3Desc: 'Adlarla (istəyə bağlı) və ətraflı təhlillərlə cəhdlərin gəlməsini izləyin.',
      templatesTitle: 'Sürətli Başlanğıc Şablonları',
      templatesDesc: 'Şablonu yükləyin və fərdiləşdirin. Dostlar, tərəfdaşlar və ya ailə üçün mükəmməldir.',
    },
    create: {
      title: 'Yeni Test Yarat',
      quizTitle: 'Test Başlığı',
      quizTitlePlaceholder: 'Məni nə qədər yaxşı tanıyırsan?',
      description: 'Təsvir (istəyə bağlı)',
      descriptionPlaceholder: 'Ən yaxın dostlarım üçün əyləncəli test...',
      questions: 'Suallar',
      addQuestion: 'Sual Əlavə Et',
      removeQuestion: 'Sil',
      questionLabel: 'Sual',
      optionLabel: 'Variant',
      correctAnswer: 'Düzgün Cavab',
      selectCorrect: 'Düzgün variantı seçin',
      templates: 'Sürətli Şablonlar',
      bestFriend: 'Ən Yaxşı Dost Testi',
      boyfriendGirlfriend: 'Sevgili Testi',
      siblings: 'Qardaş/Bacı Testi',
      loadTemplate: 'Şablonu Yüklə',
      loadTemplateConfirm: 'Bu, cari suallarınızı əvəz edəcək. Davam?',
      createButton: 'Testi Yarat',
      creating: 'Yaradılır...',
      successTitle: 'Test Uğurla Yaradıldı!',
      takeQuizLink: 'Testi Keçmək Linki',
      resultsLink: 'Nəticələrə Baxmaq Linki',
      copyLink: 'Linki Kopyala',
      createAnother: 'Başqa Test Yarat',
      validation: {
        titleRequired: 'Zəhmət olmasa test başlığı daxil edin',
        minQuestions: 'Zəhmət olmasa ən azı 1 sual əlavə edin',
        maxQuestions: 'Maksimum 15 sual icazə verilir',
        questionRequired: 'Sual mətni tələb olunur',
        optionsRequired: 'Bütün 4 variant tələb olunur',
        duplicateOptions: 'Variantlar unikal olmalıdır',
      },
    },
    quiz: {
      enterName: 'Adınızı daxil edin (istəyə bağlı)',
      namePlaceholder: 'Adınız burada...',
      startQuiz: 'Testə Başla',
      progress: 'Sual {current} / {total}',
      yourAnswer: 'Sizin cavabınız',
      correctAnswer: 'Düzgün cavab',
      score: 'Sizin Nəticəniz',
      correctCount: '{correct} / {total} düzgün',
      breakdown: 'Ətraflı Təhlil',
      retakeQuiz: 'Testi Təkrar Keç',
      viewResults: 'Bütün Nəticələrə Bax',
      thankYou: 'Testi keçdiyiniz üçün təşəkkürlər!',
    },
    results: {
      title: 'Test Nəticələri',
      totalAttempts: 'Ümumi Cəhdlər',
      averageScore: 'Orta Nəticə',
      attempts: 'Cəhdlər',
      newestFirst: 'Ən yenilər əvvəl',
      participant: 'İştirakçı',
      score: 'Nəticə',
      date: 'Tarix',
      viewDetails: 'Detallara Bax',
      hideDetails: 'Detalları Gizlət',
      yourAnswers: 'Cavablar',
      noAttempts: 'Hələ cəhd yoxdur. Testi Keçmək linkini paylaşın!',
      shareTakeLink: 'Testi Keçmək Linkini Paylaş',
    },
    notFound: {
      title: 'Test Tapılmadı',
      description: 'Bu test linki etibarsızdır və ya silinib.',
      goHome: 'Ana Səhifəyə Qayıt',
    },
  },
  ru: {
    common: {
      appName: 'UnsentAz',
      tagline: 'Анонимные викторины "Насколько хорошо ты меня знаешь?"',
      createQuiz: 'Создать викторину',
      takeQuiz: 'Пройти викторину',
      viewResults: 'Посмотреть результаты',
      copy: 'Копировать',
      copied: 'Скопировано в буфер обмена!',
      anonymous: 'Аноним',
      loading: 'Загрузка...',
      error: 'Что-то пошло не так',
      tryAgain: 'Попробовать снова',
      back: 'Назад',
      next: 'Далее',
      submit: 'Отправить викторину',
      cancel: 'Отмена',
      save: 'Сохранить',
      edit: 'Редактировать',
    },
    home: {
      heroTitle: 'Создавайте красивые анонимные викторины.',
      heroSubtitle: 'Поделитесь ссылкой. Получайте честные ответы. 100% конфиденциально — без аккаунтов и отслеживания.',
      startCreating: 'Начать создание',
      howItWorks: 'Как это работает',
      step1: 'Создайте викторину',
      step1Desc: 'Добавьте до 15 вопросов с 4 вариантами каждый. Используйте шаблоны или создайте с нуля.',
      step2: 'Поделитесь ссылкой',
      step2Desc: 'Получите две ссылки: одну для прохождения, другую для просмотра результатов.',
      step3: 'Смотрите результаты',
      step3Desc: 'Отслеживайте попытки с именами (опционально) и подробными разборами.',
      templatesTitle: 'Шаблоны быстрого старта',
      templatesDesc: 'Загрузите шаблон и настройте его. Идеально для друзей, партнёров или семьи.',
    },
    create: {
      title: 'Создать новую викторину',
      quizTitle: 'Название викторины',
      quizTitlePlaceholder: 'Насколько хорошо ты меня знаешь?',
      description: 'Описание (опционально)',
      descriptionPlaceholder: 'Весёлая викторина для моих близких друзей...',
      questions: 'Вопросы',
      addQuestion: 'Добавить вопрос',
      removeQuestion: 'Удалить',
      questionLabel: 'Вопрос',
      optionLabel: 'Вариант',
      correctAnswer: 'Правильный ответ',
      selectCorrect: 'Выберите правильный вариант',
      templates: 'Быстрые шаблоны',
      bestFriend: 'Викторина для лучшего друга',
      boyfriendGirlfriend: 'Викторина для пары',
      siblings: 'Викторина для братьев/сестёр',
      loadTemplate: 'Загрузить шаблон',
      loadTemplateConfirm: 'Это заменит текущие вопросы. Продолжить?',
      createButton: 'Создать викторину',
      creating: 'Создание...',
      successTitle: 'Викторина успешно создана!',
      takeQuizLink: 'Ссылка для прохождения',
      resultsLink: 'Ссылка для просмотра результатов',
      copyLink: 'Копировать ссылку',
      createAnother: 'Создать другую викторину',
      validation: {
        titleRequired: 'Пожалуйста, введите название викторины',
        minQuestions: 'Пожалуйста, добавьте хотя бы 1 вопрос',
        maxQuestions: 'Максимум 15 вопросов разрешено',
        questionRequired: 'Текст вопроса обязателен',
        optionsRequired: 'Все 4 варианта обязательны',
        duplicateOptions: 'Варианты должны быть уникальными',
      },
    },
    quiz: {
      enterName: 'Введите ваше имя (опционально)',
      namePlaceholder: 'Ваше имя здесь...',
      startQuiz: 'Начать викторину',
      progress: 'Вопрос {current} из {total}',
      yourAnswer: 'Ваш ответ',
      correctAnswer: 'Правильный ответ',
      score: 'Ваш результат',
      correctCount: '{correct} из {total} правильно',
      breakdown: 'Подробный разбор',
      retakeQuiz: 'Пройти заново',
      viewResults: 'Посмотреть все результаты',
      thankYou: 'Спасибо за прохождение викторины!',
    },
    results: {
      title: 'Результаты викторины',
      totalAttempts: 'Всего попыток',
      averageScore: 'Средний результат',
      attempts: 'Попытки',
      newestFirst: 'Сначала новые',
      participant: 'Участник',
      score: 'Результат',
      date: 'Дата',
      viewDetails: 'Показать детали',
      hideDetails: 'Скрыть детали',
      yourAnswers: 'Ответы',
      noAttempts: 'Пока нет попыток. Поделитесь ссылкой для прохождения!',
      shareTakeLink: 'Поделиться ссылкой для прохождения',
    },
    notFound: {
      title: 'Викторина не найдена',
      description: 'Эта ссылка на викторину недействительна или была удалена.',
      goHome: 'На главную',
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('unsentaz-language') as Language | null
    if (saved && ['en', 'az', 'ru'].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('unsentaz-language', lang)
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English
        let fallback: any = translations.en
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk]
          } else {
            return key
          }
        }
        value = typeof fallback === 'string' ? fallback : key
        break
      }
    }
    
    let result = typeof value === 'string' ? value : key
    
    // Simple interpolation {var}
    if (params) {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(params[paramKey]))
      })
    }
    
    return result
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}