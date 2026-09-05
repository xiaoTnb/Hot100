import type { ComponentType, ReactNode } from 'react'
import type { CodeLanguage } from '../components/player/types'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ProblemDefinition {
  slug: string
  number: string
  leetcodeId: string
  title: string
  difficulty: Difficulty
  difficultyLabel: string
  tags: string[]
  languages?: CodeLanguage[]
  url: string
  lead: ReactNode
  note: string
  example: ReactNode
  Visualizer: ComponentType
}
