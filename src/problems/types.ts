import type { ComponentType, ReactNode } from 'react'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ProblemDefinition {
  slug: string
  number: string
  leetcodeId: string
  title: string
  difficulty: Difficulty
  difficultyLabel: string
  tags: string[]
  url: string
  lead: ReactNode
  note: string
  example: ReactNode
  Visualizer: ComponentType
}
