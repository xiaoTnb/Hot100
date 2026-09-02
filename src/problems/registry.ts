import { groupAnagramsProblem } from './group-anagrams/definition'
import { twoSumProblem } from './two-sum/definition'
import type { ProblemDefinition } from './types'

export const problems: ProblemDefinition[] = [
  twoSumProblem,
  groupAnagramsProblem,
]

export function findProblem(slug: string | null): ProblemDefinition | undefined {
  return problems.find((problem) => problem.slug === slug)
}
