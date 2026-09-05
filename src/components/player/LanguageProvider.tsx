import type { ReactNode } from 'react'
import { LanguageContext, type LanguageContextValue } from './language-context'

export function LanguageProvider({ value, children }: { value: LanguageContextValue; children: ReactNode }) {
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
