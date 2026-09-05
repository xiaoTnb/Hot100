import { createContext, useContext } from 'react'
import type { CodeLanguage } from './types'

export interface LanguageContextValue {
  language: CodeLanguage
  setLanguage: (language: CodeLanguage) => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useCodeLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useCodeLanguage must be used inside LanguageProvider')
  return value
}
